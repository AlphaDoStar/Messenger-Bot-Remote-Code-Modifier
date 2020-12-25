const FileManager = require('FileManager');
const MessageProcessor = require('MessageProcessor');
const CodeEditor = require('CodeEditorTool');

const Setting = function () {
    this.workingRoom = null;
    this.workingUser = null;
    this.botFolderPath = null;
    this.allowedRoom = new Array();
    this.allowedUser = new Array();
};

let setting = new FileManager('Bot/RemoteCodeModifier/Setting.txt'),
    content = new Setting(),
    progress = 'default',
    mistake = 0;

function response(room, msg, sender, isGroupChat, replier) {
    let cmd = new MessageProcessor();

    if (setting.read()) {
        content = setting.read();

        /*switch (progress) {
            case 'default': {
                if (cmd.isMsg('열기')) {
                    replier.reply('');
                }
                
                break;
            }

            case 'modifying': {
                //
                
                break;
            }
        }*/

        setting.write(content);

    } else {
        switch (progress) {
            case 'default': {
                if (msg.equals('세팅')) {
                    replier.reply('원격 코드 수정기의 기본 세팅을 시작합니다.');
                    replier.reply('메신저봇 폴더의 경로를 입력해 주세요.\nEx) /sdcard/msgbot/');
                    replier.reply('(1) 취소');
                    content.workingRoom = room;
                    content.workingUser = sender;
                    progress = 'setting_1';
                }

                break;
            }

            case 'setting_1': {
                if (content.workingRoom !== room || content.workingUser !== sender) break;

                if (['(1)', '1', '취소'].includes(msg)) {
                    mistake = 0;
                    content = new Setting();
                    replier.reply('세팅을 중단하였습니다.');
                    progress = 'default';
                
                } else if (/^\/sdcard\/(.+)\/$/.test(msg)) {
                    mistake = 0;

                    if (new java.io.File(msg).exists()) {
                        let fileList = new java.io.File(msg).list();

                        if (fileList.includes('Bots') && fileList.includes('global_modules')) {
                            content.botFolderPath = RegExp.$1;
                            replier.reply('메신저봇 폴더의 경로가 [ ' + msg + ' ] 로 설정되었습니다.');
                            replier.reply('명령어 사용을 허용할 방을 선택해 주세요.');
                            replier.reply('(1) 모든 채팅방\n(2) 이 채팅방\n(3) 직접 입력\n(4) 취소');
                            progress = 'setting_2';

                        } else {
                            replier.reply('해당 폴더의 하위 디렉토리에서 "Bots" 폴더와 "global_modules" 폴더를 찾을 수 없습니다.');
                            replier.reply('메신저봇 폴더의 경로를 다시 입력해 주세요.\nEx) /sdcard/msgbot/');
                        }

                    } else {
                        replier.reply('해당 폴더를 찾을 수 없습니다.');
                        replier.reply('메신저봇 폴더의 경로를 다시 입력해 주세요.\nEx) /sdcard/msgbot/');
                    }
                
                } else if (mistake < 4) {
                    mistake += 1;
                    replier.reply('메신저봇 폴더의 경로를 다시 입력해 주세요.\nEx) /sdcard/msgbot/');
                    replier.reply('(1) 취소');

                } else {
                    mistake = 0;
                    content = new Setting();
                    replier.reply('도배가 우려되어 기본 세팅을 강제 중단합니다.');
                    progress = 'default';
                }

                break;
            }

            case 'setting_2': {
                if (content.workingRoom !== room || content.workingUser !== sender) break;

                if (['(1)', '1', '모든 채팅방'].includes(msg)) {
                    mistake = 0;
                    replier.reply('[ 모든 채팅방에서 작동 ] 옵션이 설정되었습니다.');
                    replier.reply('명령어 사용을 허용할 대상을 선택해 주세요.');
                    replier.reply('(1) 모든 사람\n(2) ' + sender + '\n(3) 취소');
                    progress = 'setting_3';
                
                } else if (['(2)', '2', '이 채팅방'].includes(msg)) {
                    mistake = 0;
                    content.allowedRoom.push(room);
                    replier.reply('[ ' + room + ' 방에서 작동 ] 옵션이 설정되었습니다.');
                    replier.reply('명령어 사용을 허용할 대상을 선택해 주세요.');
                    replier.reply('(1) 모든 사람\n(2) ' + sender + '\n(3) 취소');
                    progress = 'setting_3';
                
                } else if (['(3)', '3', '직접 입력'].includes(msg)) {
                    mistake = 0;
                    replier.reply('명령어 사용을 허용할 방을 입력해 주세요.');
                    replier.reply('(1) 취소');
                    progress = 'setting_2-1';

                } else if (['(4)', '4', '취소'].includes(msg)) {
                    mistake = 0;
                    content = new Setting();
                    replier.reply('세팅을 중단하였습니다.');
                    progress = 'default';
                
                } else if (mistake < 4) {
                    mistake += 1;
                    replier.reply('명령어 사용을 허용할 방을 다시 선택해 주세요.');
                    replier.reply('(1) 모든 채팅방\n(2) 이 채팅방\n(3) 직접 입력\n(4) 취소');
                
                } else {
                    mistake = 0;
                    content = new Setting();
                    replier.reply('도배가 우려되어 기본 세팅을 강제 중단합니다.');
                    progress = 'default';
                }
                
                break;
            }

            case 'setting_2-1': {
                if (content.workingRoom !== room || content.workingUser !== sender) break;

                if (['(1)', '1', '취소'].includes(msg)) {
                    content = new Setting();
                    replier.reply('세팅을 중단하였습니다.');
                    progress = 'default';
                
                } else {
                    content.allowedRoom.push(msg);
                    replier.reply('[ ' + msg + ' 방에서 작동 ] 으로 설정하시겠습니까?');
                    replier.reply('(1) 네\n(2) 아니요\n(3) 취소');
                    progress = 'setting_2-2';
                }
                
                break;
            }

            case 'setting_2-2': {
                if (content.workingRoom !== room || content.workingUser !== sender) break;

                if (['(1)', '1', '네'].includes(msg)) {
                    mistake = 0;
                    replier.reply('[ ' + content.allowedRoom[0] + ' 방에서 작동 ] 옵션이 설정되었습니다.');
                    replier.reply('명령어 사용을 허용할 대상을 선택해 주세요.');
                    replier.reply('(1) 모든 사람\n(2) ' + sender + '\n(3) 취소');
                    progress = 'setting_3';

                } else if (['(2)', '2', '아니요'].includes(msg)) {
                    mistake = 0;
                    content.allowedRoom = new Array();
                    replier.reply('명령어 사용을 허용할 방을 다시 입력해 주세요.');
                    replier.reply('(1) 취소');
                    progress = 'setting_2-1';
                
                } else if (['(3)', '3', '취소'].includes(msg)) {
                    mistake = 0;
                    content = new Setting();
                    replier.reply('세팅을 중단하였습니다.');
                    progress = 'default';
                
                } else if (mistake < 4) {
                    mistake += 1;
                    replier.reply('올바른 선택지를 선택해 주세요.');
                    replier.reply('[ ' + content.allowedRoom[0] + ' 방에서 작동 ] 으로 설정하시겠습니까?');
                    replier.reply('(1) 네\n(2) 아니요\n(3) 취소');
                
                } else {
                    mistake = 0;
                    content = new Setting();
                    replier.reply('도배가 우려되어 기본 세팅을 강제 중단합니다.');
                    progress = 'default';
                }
                
                break;
            }

            case 'setting_3': {
                if (content.workingRoom !== room || content.workingUser !== sender) break;

                if (['(1)', '1', '모든 사람'].includes(msg)) {
                    mistake = 0;
                    delete content.workingRoom;
                    delete content.workingUser;
                    setting.write(content);
                    setting.setJson();
                    replier.reply('세팅이 끝났습니다.');
                    progress = 'default';
                
                } else if (['(2)', '2', sender].includes(msg)) {
                    mistake = 0;
                    content.allowedUser.push(sender);
                    delete content.workingRoom;
                    delete content.workingUser;
                    setting.write(content);
                    setting.setJson();
                    replier.reply('세팅이 끝났습니다.');
                    progress = 'default';
                
                } else if (['(3)', '3', '취소'].includes(msg)) {
                    mistake = 0;
                    content = new Setting();
                    replier.reply('세팅을 중단하였습니다.');
                    progress = 'default';
                
                } else if (mistake < 4) {
                    mistake += 1;
                    replier.reply('명령어 사용을 허용할 대상을 다시 선택해 주세요.');
                    replier.reply('(1) 모든 사람\n(2) ' + sender + '\n(3) 취소');
                
                } else {
                    mistake = 0;
                    content = new Setting();
                    replier.reply('도배가 우려되어 기본 세팅을 강제 중단합니다.');
                    progress = 'default';
                }
                
                break;
            }
        }
    }
}

function onStartCompile() {
    if (!setting.read()) {
        Api.showToast('기본 세팅이 필요합니다.\n채팅창에 [ 세팅 ] 을 입력하세요.');

    } else {
        setting.save();
    }
}