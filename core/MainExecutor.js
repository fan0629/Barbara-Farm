const common = require("./工具方法");

function MainExecutor() {

    this.exec = function () {
        // 执行主要业务逻辑
        let singletonRequire = require('../lib/SingletonRequirer.js')(runtime, this)
        let commonFunctions = singletonRequire('CommonFunction')
        commonFunctions.requestScreenCaptureOrRestart()
        commonFunctions.ensureDeviceSizeValid()
        var speed = 0.9; //脚本速度倍率
        var WIDTH = device.width == 0 ? 1080 : device.width;
        var HEIGHT = device.height == 0 ? 2340 : device.height;
        var storage = storages.create("com.fan.芭芭农场"); //获取本地存储
        var nowDate = new Date().toLocaleDateString(); //获取当日日期
        var set = []; //记录成功操作

        var thread1 = threads.start(function () {
            setTimeout(function () {
                    toastLog("脚本超时退出");
                    exit();
                },
                450000 / speed);
        });

        main();

        function main() {
            threads.start(function () {
                setInterval(function () {
                    if (id("com.taobao.taobao:id/update_contentDialog").findOnce()) {
                        toastLog("发现升级窗口");
                        common.clickUiObject(id("com.taobao.taobao:id/update_button_cancel").findOne())
                    }
                    if (id("com.taobao.taobao:id/update_contentDialog_v2").findOnce()) {
                        toastLog("发现升级窗口");
                        common.clickUiObject(id("com.taobao.taobao:id/update_imageview_cancel_v2").findOnce())
                    }
                }, 4000 / speed)
            })
            set = storage.get(nowDate, set);
            if (set.indexOf("淘宝助力完成") == -1) {
                淘宝助力();
            }
            if (set.indexOf("支付宝助力完成") == -1) {
                支付宝助力();
            }
            launchApp("支付宝");
            log("打开支付宝");
            sleep(1000 / speed)
            if (set.indexOf("每日签到完成") == -1) {
                //每日签到()
            }

            common.clickByText("首页", 2000 / speed);
            var uiObject = boundsInside(0, 300, 1080, 1500).text("芭芭农场").findOne();
            common.clickUiObject(uiObject);
            sleep(1500 / speed)
            let dailyPoint = findColorEquals(captureScreen(), 0x8b4100, WIDTH / 2, HEIGHT / 2, WIDTH / 2, HEIGHT / 2)
            toastLog("点击领取每日肥料")
            if (dailyPoint) {
                click(dailyPoint.x, dailyPoint.y);
            }
            sleep(1000 / speed);
            common.clickByText("去领更多肥料", 1000);
            sleep(1000 / speed)
            if (!textMatches(/领取|已领取/).exists()) {
                common.clickUiObject(className("android.widget.Image").boundsInside(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT).depth(16).untilFind().get(0));
            }
            common.clickByText("立即施肥", 1000)

            sleep(1000 / speed);
            var uiObjs = text("领取").find();
            uiObjs.forEach(uiObj => {
                common.clickUiObject(uiObj);
            });
            sleep(1000 / speed);

            for (let i = 0; i < 3; i++) {
                if (!textMatches(/逛一逛领1500肥料 \(3\/3\)/).exists()) {
                    if (!textMatches(/逛一逛领1500肥料 \(.\/3\)/).findOne(1000)) {
                        common.clickUiObject(className("android.widget.Image").depth(16).untilFind().get(1));
                    }
                    let index = textMatches(/逛一逛领1500肥料 \(.\/3\)/).findOne().indexInParent()
                    common.clickUiObject(className("android.view.View").depth(17).indexInParent(index + 2).findOne().child(0))
                    sleep(2500)
                    swipe(500, 1600, 500, 1000, 2000)
                    sleep(12000)
                    textContains("浏览完成，现在下单").findOne(5000 / speed);
                    back();
                    sleep(1000 / speed);
                }
            }
            if (text("去浏览").exists()) {
                common.clickByText("去浏览");
                textContains("浏览15s得500肥料").findOne(2000 / speed);
                swipe(500, 1600, 500, 1000, 1000);
                sleep(15000)
                textMatches(/任务已经完成/).findOne(5000 / speed);
                back();
                sleep(500 / speed);
            }
            if (textContains("逛逛淘宝芭芭农场").exists()) {
                let task_info = textContains("逛逛淘宝芭芭农场").findOnce();
                let index = task_info.indexInParent()
                let btn = className("android.view.View").depth(17).indexInParent(index + 2).findOne().child(0)
                if (btn.text() == "去逛逛") {
                    common.clickUiObject(btn)
                } else {
                    launchApp("淘宝")
                }
            } else {
                launchApp("淘宝")
            }
            if (id("android.miui:id/app1").findOne(3000 / speed)) {
                id("android.miui:id/app1").findOne().click();
            }
            log("进入淘宝芭芭农场");
            text("天猫农场-福年种福果").findOne(1000 / speed);
            sleep(5000 / speed);
            common.killApp("淘宝");
            sleep(1000 / speed)
            launchApp("淘宝")
            if (id("android.miui:id/app1").findOne(3000 / speed)) {
                id("android.miui:id/app1").findOne().click();
            }
            sleep(1000 / speed)

            common.clickByDesc("首页", 1000 / sleep)
            while (!text("芭芭农场").exists()) {
                swipe(500, 800, 500, 1200, 1000)
                sleep(1000)
            }
            sleep(1000)
            common.clickByDesc("芭芭农场", 1000 / speed)
            sleep(3000 / speed)
            for (var i = 0; i < 4; i++) {
                common.clickUiObject(text("继续赚肥料").findOnce());
                common.clickUiObject(text("关闭").findOnce());
                common.clickUiObject(text("继续努力").findOnce());
                if (common.clickUiObject(text("立即领取").findOnce())) {
                    sleep(1000)
                    if (className("android.widget.Image").text("合种亲密度").exists()) {
                        let img_get_list = className("android.widget.Image").text("领取肥料").find();
                        if (img_get_list) {
                            img_get_list.forEach(uiObjs => {
                                let btn_get = uiObjs.parent().parent().findOne(text("立即领取"));
                                common.clickUiObject(btn_get);
                                sleep(500 / speed);
                            })
                        }
                    }
                }
            }
            log("点击领取每日肥料")
            let taobaoDailyPoint = findColorEquals(captureScreen(), 0x8b4100, WIDTH / 2, HEIGHT / 2, WIDTH / 2, HEIGHT / 2)
            click(taobaoDailyPoint.x, taobaoDailyPoint.y);
            common.clickByTextContains("关闭", 2000 / speed)
            sleep(1000 / speed)
            click(WIDTH - taobaoDailyPoint.x, taobaoDailyPoint.y)
            sleep(1000 / speed)
            common.clickUiObject(className("android.widget.Image").depth(13).clickable().indexInParent(2).findOne());
            sleep(1500 / speed);
            click("去签到");
            swipe(500, 1800, 500, 1200, 1000);
            click("去领取");
            sleep(1500 / speed);

            for (let j = 0; j < 3; j++) {
                for (let i = 0; i < 15; i++) {
                    let list = getButtons();
                    if (i >= list.size()) {
                        break;
                    }
                    let btn = list.get(i)
                    let btn_text = btn.text()
                    log("第" + i + "次循环")
                    var task_info = btn.parent().child(0).child(0).text();
                    if (task_info.includes("下单")) {
                        log("结束本次循环")
                        continue;
                    }
                    if (btn_text == "去完成") {
                        if (task_info == "浏览天天领现金(0/1)") {
                            common.clickUiObject(btn)
                            sleep(1500)
                            click(990, 588);
                            sleep(15000)
                            textContains("全部完成啦").findOne(5000 / speed);
                            back();
                        } else if (task_info == "走走路就轻松赚到钱(0/1)") {
                            continue;
                        }
                    } else if (btn_text == "去浏览") {
                        if (task_info == "搜一搜你心仪的宝贝(0/1)") {
                            common.clickUiObject(btn)
                            common.clickByDesc("卫衣");
                            common.clickByText("卫衣", 1000);
                            sleep(12000);
                            back();
                            sleep(1000);
                            back();
                        } else {
                            common.clickUiObject(btn)
                            sleep(16000)
                            textContains("全部完成啦").findOne(5000 / speed);
                            sleep(1000)
                            back();
                        }
                    } else if (btn_text == "去逛逛") {
                        if (task_info == "逛逛支付宝芭芭农场(0/1)" && j == 2) {
                            common.clickUiObject(btn);
                            施肥()
                            //common.closeCurrentApp();
                        } else if (task_info.includes("淘宝人生")) {
                            common.clickUiObject(btn);
                            text("淘宝人生").findOne(4000 / speed)
                            sleep(7000 / speed);
                            click(500, 2000);
                            sleep(4000 / speed);
                            back();
                            sleep(1500 / speed);
                        } else if (task_info == "逛精选好物(0/1)") {
                            common.clickUiObject(btn);
                            sleep(1000 / speed);
                            swipe(500, 1800, 500, 1200, 2000);
                            sleep(12000)
                            textContains("浏览完成，现在下单").findOne(5000 / speed);
                            back();
                            sleep(1000 / speed);
                        }
                    }
                }
            }
            common.clickByText("跳转链接")
            施肥()
        }

        function 淘宝助力() {
            launchApp("淘宝");
            if (id("android.miui:id/app1").findOne(2000 / speed)) {
                id("android.miui:id/app1").findOne().click();
            }

            sleep(3000 / speed);
            common.clickByDesc("消息");
            sleep(2000 / speed)
            common.clickByText("淘宝种树群", 1000 / speed);
            common.clickByDesc("淘宝种树群", 1000 / speed);
            var uiObjects = desc("拜托帮我助力一下吧～你也可以领免费水果！").untilFind();

            toastLog("发现" + uiObjects.length + "个可助力")
            for (var i = 0; i < uiObjects.length; i++) {
                var uiObject = desc("拜托帮我助力一下吧～你也可以领免费水果！").untilFind().get(i);
                var b = uiObject.parent().parent().bounds().centerX();
                if (b < WIDTH / 2) {
                    sleep(1000 / speed);
                    common.clickUiObject(uiObject);
                    sleep(1500 / speed);
                    common.clickByText("为TA助力");
                    sleep(1000 / speed);
                    back();
                }
            }
            set.push("淘宝助力完成")
            storage.clear();
            storage.put(nowDate, set);
        }

        function 支付宝助力() {
            launchApp("支付宝");
            sleep(3000 / speed);
            common.clickByTextMatches(/消息|朋友/);
            common.clickByText("种树群");
            var uiObjects = text("帮我助力，你也有奖励").untilFind();
            toastLog("发现" + uiObjects.length + "个可助力");
            for (var i = 0; i < uiObjects.length; i++) {
                var uiObject = text("帮我助力，你也有奖励").untilFind().get(i);
                var b = uiObject.parent().parent().findOne(id("com.alipay.mobile.chatapp:id/chat_msg_avatar"));
                if (b && b.bounds().centerX() < WIDTH / 2) {
                    common.clickUiObject(uiObject);
                    sleep(2500 / speed);
                    common.clickByText("为Ta助力");
                    sleep(1500 / speed);
                    back();
                    sleep(1000 / speed);
                }
            }
            sleep(1500 / speed);
            back();
            sleep(1000 / speed);
            set.push("支付宝助力完成");
            storage.clear();
            storage.put(nowDate, set);
        }

        function getButtons() {
            return className("android.widget.Button").depth(17).find();
        }

        function 每日签到() {
            common.clickByText("我的")
            sleep(2500)
            click(500, 500)
            sleep(2000);
            common.clickByText("全部领取")
            sleep(1000)
            common.clickByTextMatches(/签到领积分|每日赚积分|做任务赚积分|每日签到/);
            sleep(1000);
            赚积分()
            back()
            sleep(1000)
            back()
            set.push("每日签到完成")
            storage.clear()
            storage.put(nowDate, set)
        }

        function 赚积分() {
            swipe(500, 1700, 500, 1000, 1000);
            sleep(1000 / speed);
            for (var i = 0; i < 5; i++) {
                subject = textMatches(/.*赚3积分|.*赚5积分/).findOne(1000 / speed)
                if (subject) {
                    var str = subject.parent().child(0).child(0).text();
                    toastLog(str)
                    if (str.includes("答题")) {
                        subject = textMatches(/.*赚3积分|.*赚5积分/).findOnce(1);
                        if (subject == null) {
                            break;
                        }
                        str = subject.parent().child(0).child(0).text();
                    }
                    common.clickUiObject(subject.parent().parent().findOne(className("android.widget.Button").text("去完成").clickable()));
                    if (id("android.miui:id/app1").findOne(3000)) {
                        common.clickByText("取消", 1000 / speed);
                    }
                    if (str.includes("淘金币")) {
                        sleep(1000 / speed);
                        launchApp("支付宝")
                    } else if (str.includes("施肥")) {
                        let teskBtn = className("android.widget.Image").depth(16).untilFind().get(1)
                        let pointY = teskBtn.bounds().centerY()
                        click(540, pointY);
                    } else if (str.includes("15")) {
                        sleep(16000);
                    } else if (str.includes("逛天猫")) {
                        sleep(1000 / speed);
                        launchApp("支付宝")
                        sleep(16000);
                    }
                    sleep(1000 / speed);
                    back();
                    sleep(1500 / speed)
                }
            }
            swipe(500, 1800, 500, 100, 1000)
            swipe(500, 1800, 500, 100, 1000)
            sleep(18000)
        }

        function 施肥() {
            sleep(1000 / speed);
            let flag = common.clickByText("继续赚肥料", 5000 / speed)
            if (flag) {
                sleep(1000 / speed);
                common.clickUiObject(className("android.view.View").clickable().depth(16).untilFind().get(0));
            }
            click(500, 400);
            common.clickByText("立即施肥", 2000)
            //className("android.webkit.WebView").findOne().child(0).child(0).child(5).child(0).child(1).click();
            let teskBtn = className("android.widget.Image").depth(16).untilFind().get(1)
            let pointY = teskBtn.bounds().centerY()
            for (let i = 0; i < 150; i++) {
                click(540, pointY);
                sleep(700)
                if (text("果树升级啦").exists()) {
                    sleep(600)
                    common.clickUiObject(text("果树升级啦").findOnce().parent().parent().child(2))
                    sleep(600)
                }
                if (text("点击领取").exists()) {
                    sleep(600)
                    common.clickByText("点击领取", 1000)
                    sleep(600)
                    common.clickByText("收下去施肥", 1000)
                    sleep(600)
                }
                if (textMatches(/领取|已领取/).exists()) {
                    break
                }
            }
            toastLog("施肥完成")
            exit()
        }
    }
}

module.exports = new MainExecutor()