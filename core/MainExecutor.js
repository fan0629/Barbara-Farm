let common = require("./工具方法");
let speed = 0.9; //脚本速度倍率
let WIDTH = config.device_width;
let HEIGHT = config.device_height;
let storage = storages.create("com.fan.芭芭农场"); //获取本地存储
let nowDate = new Date().toLocaleDateString(); //获取当日日期
let set = []; //记录成功操作

module.exports = {
    exec() {
        main();
    }
}

function main() {
    common.killApp("支付宝")
    threads.start(function() {
        setInterval(function() {
            if (id("com.taobao.taobao:id/update_contentDialog").findOnce()) {
                toastLog("发现升级窗口");
                common.clickUiObject(id("com.taobao.taobao:id/update_button_cancel").findOne())
            }
            if (id("com.taobao.taobao:id/update_contentDialog_v2").findOnce()) {
                toastLog("发现升级窗口");
                common.clickUiObject(id("com.taobao.taobao:id/update_imageview_cancel_v2").findOnce())
            }
            if (desc("浮层关闭按钮").findOnce()) {
                toastLog("发现浮层通知");
                common.clickUiObject(desc("浮层关闭按钮").findOnce());
            }
            if (id("com.alipay.mobile.blessingcard:id/iv_dialog_close").findOnce()) {
                common.clickUiObject(id("com.alipay.mobile.blessingcard:id/iv_dialog_close").findOnce());
            }
            if (id("com.alipay.mobile.blessingcard:id/cr_close").findOnce()) {
                common.clickUiObject(id("com.alipay.mobile.blessingcard:id/cr_close").findOnce())
            }
        }, 4000 / speed)
    })
    set = storage.get(nowDate, set);
    if (set.indexOf("淘宝助力完成") === -1) {
        淘宝助力();
    }
    if (set.indexOf("支付宝助力完成") === -1) {
        支付宝助力();
    }
    launchApp("支付宝");
    log("打开支付宝");
    sleep(1000 / speed)

    if (set.indexOf("每日签到完成") === -1) {
        //每日签到()
    }

    common.clickByText("首页", 2000 / speed);
    var uiObject = boundsInside(0, 300, 1080, 1100).text("芭芭农场").findOne();
    common.clickUiObject(uiObject);
    text("🇨🇳🏅+…").findOne(4000 / speed);
    sleep(1000 / speed)
    let img = captureScreen();
    let result = $mlKitOcr.detect(img)
    result.forEach((ocr) => {
        if (ocr.label.includes("点击领取") ||
            ocr.label.includes("点击領取") ||
            ocr.label.includes("点击颌取")) {
            click(ocr.bounds.centerX(), ocr.bounds.centerY())
        }
    })

    sleep(1000 / speed);
    common.clickByText("去领更多肥料", 1000);
    sleep(1000 / speed)
    if (!textMatches(/领取|已领取/).exists()) {
        if (text("任务列表").exists()) {
            common.clickByText("任务列表");
        } else {
            common.clickUiObject(className("android.widget.Image").boundsInside(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT).depth(16).untilFind().get(0));
        }
    }
    common.clickByText("立即施肥", 1000)
    sleep(1000 / speed);
    for (let i = 0; i < 4; i++) {
        let parent = className("android.widget.Button").depth(18).textMatches(/去浏览|去完成|去逛逛|去看看/).findOne().parent().parent();
        parent.children().forEach((child, index) => {
            if (index % 4 !== 2 || index + 2 >= parent.children().size()) {
                return;
            }
            let obj = parent.child(child.indexInParent() + 2)
            if (obj == null) {
                return;
            }
            let task_btn = obj.findOne(textMatches(/去浏览|去完成|去逛逛|去看看/));
            let task_info = child.text().trim();
            if (task_info === "" ||
                task_info.includes("逛逛淘宝芭芭农场 (0/1)") ||
                task_info.includes("逛精选好物得1500肥料 (1/1)") ||
                task_info.includes("逛一逛领1500肥料 (3/3)") ||
                task_info.includes("去淘特领好礼 (0/1)") ||
                task_info.includes("看精选商品得1500肥料 (3/3)")) {
                return;
            }
            log(task_info)
            switch (task_info) {
                case "逛精选好物得1500肥料 (0/1)":
                case "逛一逛领1500肥料 (0/3)":
                case "逛一逛领1500肥料 (1/3)":
                case "逛一逛领1500肥料 (2/3)":
                case "看精选商品得1500肥料 (0/3)":
                case "看精选商品得1500肥料 (1/3)":
                case "看精选商品得1500肥料 (2/3)":
                case "逛年货节，领500肥料 (0/1)":
                case "逛好物最高得2000肥料 (0/1)":
                    common.clickUiObject(task_btn);
                    sleep(1500)
                    swipe(500, 1600, 500, 1000, 15000)
                    textContains("浏览完成，现在下单").findOne(2000 / speed);
                    sleep(800);
                    back();
                    break;
                case "逛逛花呗翻翻卡 (0/1)":
                case "逛一逛芝麻分 (0/1)":
                case "逛一逛花花卡 (0/1)":
                case "逛逛UC浏览器得肥料 (0/1)":
                case "去天猫攒福气兑红包 (0/1)":
                case "看助农故事领100肥料 (0/1)":
                    common.clickUiObject(task_btn);
                    sleep(2000 / speed);
                    back();
                    sleep(1500)
                    let uiObjs = text("领取").find();
                    uiObjs.forEach(uiObj => {
                        common.clickUiObject(uiObj);
                    });
                    break;
                default:
                    log("跳过任务");
                    return;
            }
            sleep(1000 / speed);
        })
    }
    let uiObjs = text("领取").find();
    uiObjs.forEach(uiObj => {
        common.clickUiObject(uiObj);
    });
    sleep(1000 / speed);
    if (textContains("逛逛淘宝芭芭农场 (0/1)").exists()) {
        let task = textContains("逛逛淘宝芭芭农场 (0/1)").findOnce();
        let index = task.indexInParent();
        let btn = className("android.view.View").depth(17).indexInParent(index + 2).findOne().child(0);
        common.clickUiObject(btn);
        if (id("android.miui:id/app1").findOne(3000 / speed)) {
            id("android.miui:id/app1").findOne().click();
        }
        text("900肥料已到账，加油赚更多！").findOne(8000);
        sleep(1000 / speed);
        common.killApp("淘宝");
        sleep(1000 / speed)
        launchApp("淘宝")
    } else {
        launchApp("淘宝");
    }
    if (id("android.miui:id/app1").findOne(3000 / speed)) {
        id("android.miui:id/app1").findOne().click();
    }
    sleep(1000 / speed)
    log("进入淘宝芭芭农场");
    common.clickByDesc("首页", 1000 / sleep)
    while (!text("芭芭农场").exists()) {
        swipe(500, 800, 500, 1200, 1000)
        sleep(1000)
    }
    sleep(1000)
    common.clickByDesc("芭芭农场")
    className("android.widget.Image").text("头像").findOne(3000 / speed)
    for (var i = 0; i < 5; i++) {
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
        sleep(600 / speed)
    }

    img = captureScreen();
    result = $mlKitOcr.detect(img)
    result.forEach((ocr) => {
        if (ocr.label.includes("点击领取") ||
            ocr.label.includes("点击領取") ||
            ocr.label.includes("点击颌取")) {
            click(ocr.bounds.centerX(), ocr.bounds.centerY())
            log("点击领取每日肥料")
        }
    })

    sleep(1000 / speed)
    common.clickUiObject(className("android.widget.Image").depth(13).clickable().indexInParent(2).findOne());
    sleep(1500 / speed);
    common.clickByText("去签到", 1000);
    swipe(500, 1800, 500, 1200, 1000);
    common.clickByText("去领取", 1000);
    sleep(1500 / speed);

    for (let j = 0; j < 5; j++) {
        for (let i = 0; i < 15; i++) {
            let list = getButtons();
            if (i >= list.size()) {
                break;
            }
            let btn = list.get(i)
            let btn_text = btn.text()
            var task_info = btn.parent().child(0).child(0).text();
            if (task_info.includes("下单") ||
                task_info === "逛逛支付宝芭芭农场(0/1)" ||
                task_info === "买精选商品送2万肥料(0/2)" ||
                task_info === "逛精选商品(3/3)"
            ) {
                continue;
            }
            log(task_info)
            switch (task_info) {
                case "浏览天天领现金(0/1)":
                    common.clickUiObject(btn)
                    sleep(1500)
                    click(990, 588);
                    sleep(15000)
                    textContains("全部完成啦").findOne(5000 / speed);
                    back();
                    sleep(1000);
                    break;
                case "搜一搜你心仪的宝贝(0/1)":
                case "搜一搜你喜欢的商品(0/1)":
                case "搜一搜你喜欢的商品(0/2)":
                case "搜一搜你喜欢的商品(1/2)":
                    common.clickUiObject(btn)
                    sleep(1000);
                    className("android.widget.ListView").findOne(3000);
                    let label_list = className("android.widget.ListView").find();
                    let label_btn = label_list.findOne(clickable());
                    if (text("卫衣").exists() || desc("卫衣").exists()) {
                        common.clickByText("卫衣", 1000);
                        common.clickByDesc("卫衣", 1000);
                        swipe(500, 1900, 500, 400, 16000);
                    } else {

                        common.clickUiObject(label_btn, false);
                        text("滑动浏览 15 秒得").findOne(3000);
                        sleep(500 / speed);
                        swipe(500, 1900, 500, 400, 16000);
                    }
                    while (!text("去完成").exists()) {
                        back();
                        sleep(1000);
                    }
                    break;
                case "浏览金币小镇得肥料(0/1)":
                case "浏览店铺有好礼(0/1)":
                case "浏览短视频(0/1)":
                    common.clickUiObject(btn);
                    sleep(1500)
                    swipe(500, 1600, 500, 1000, 2000)
                    sleep(15000);
                    textContains("全部完成啦").findOne(5000 / speed);
                    sleep(1500 / speed);
                    back();
                    sleep(1000);
                    break;
                case "走走路就轻松赚到钱(0/1)":
                case "来打工赚提现红包(0/1)":
                case "去每天打工赚零花钱(0/1)":
                    common.clickUiObject(btn);
                    let live_pkg = "com.taobao.live";
                    let _pkg_mgr = context.getPackageManager();
                    let _app_name, _app_info;
                    try {
                        _app_info = _pkg_mgr.getApplicationInfo(live_pkg, 0);
                        _app_name = _pkg_mgr.getApplicationLabel(_app_info);
                    } catch (e) {
                        error(e)
                    }
                    if (_app_name) {
                        common.clickByText("下载/打开APP", 2000, false);
                        sleep(500);
                        common.clickUiObject(id("com.taobao.taobao:id/confirm_yes").findOne(1000));
                        sleep(5000);
                        common.killApp("点淘")
                        sleep(3000 / speed);
                    } else {
                        toastLog("未安装点淘app");
                    }
                    sleep(1000 / speed);
                    if (!text("去完成").exists()) {
                        back();
                        sleep(1000);
                    }
                    break;
                case "逛精选商品(0/3)":
                case "逛精选商品(1/3)":
                case "逛精选商品(2/3)":
                    common.clickUiObject(btn);
                    sleep(2500)
                    swipe(500, 1600, 500, 1000, 2000)
                    sleep(12000)
                    textContains("浏览完成，现在下单").findOne(5000 / speed);
                    sleep(800);
                    back();
                    sleep(1000);
                    break;
                case "逛精选好物(0/1)":
                case "逛精选好货(0/1)":
                case "浏览页面有好礼(0/1)":
                case "浏览变美体验官活动(0/1)":
                case "逛精选好货(0/5)":
                case "逛精选好货(1/5)":
                case "逛精选好货(2/5)":
                case "逛精选好货(3/5)":
                case "逛精选好货(4/5)":
                case "逛精选好货(0/2)":
                case "逛精选好货(1/2)":
                    common.clickUiObject(btn);
                    sleep(1000 / speed);
                    swipe(500, 1800, 500, 1200, 15000);
                    sleep(1000);
                    //textContains("任务完成").findOne(5000 / speed);
                    sleep(1000 / speed);
                    back();
                    sleep(1000);
                    break;
                default:
                    if (btn_text === "去浏览") {
                        common.clickUiObject(btn);
                        sleep(15000);
                        textContains("全部完成啦").findOne(5000 / speed);
                        sleep(1500 / speed);
                        back();
                        sleep(1000);
                        break;
                    } else {
                        log("跳过任务");
                    }
            }
            //sleep(400 / speed);
        }
    }

    if (text("逛逛支付宝芭芭农场(0/1)").exists()) {
        common.clickUiObject(text("逛逛支付宝芭芭农场(0/1)").findOne().parent().parent());
    } else {
        common.clickByText("跳转链接")
    }
    施肥()
}

function 淘宝助力() {
    launchApp("淘宝");
    if (id("android.miui:id/app1").findOne(2000 / speed)) {
        id("android.miui:id/app1").findOne().click();
    }

    sleep(1000 / speed);
    common.clickByDesc("消息");
    sleep(1000 / speed)
    common.clickUiObject(desc("淘宝种树群").findOne().parent());
    sleep(1500 / speed)

    let uiObjects = id("com.taobao.taobao:id/chat_msg_item_wrapper")
        .untilFind()
    for (var i = 0; i < uiObjects.length; i++) {
        var uiObject = id("com.taobao.taobao:id/chat_msg_item_wrapper")
            .untilFind()
            .get(i)
        if (uiObject.findOne(id("com.taobao.taobao:id/user_head_layout")).bounds().centerX() < WIDTH / 2) {
            let btn = uiObject
                .findOne(desc("拜托帮我助力一下吧～你也可以领免费水果！"));
            sleep(1000 / speed);
            common.clickUiObject(btn);
            sleep(1500 / speed);
            common.clickByText("立即助力");
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
    sleep(1500 / speed)
    let uiObjects = id("com.alipay.mobile.chatapp:id/chat_msg_layout")
        .untilFind()
    for (var i = 0; i < uiObjects.length; i++) {
        var uiObject = id("com.alipay.mobile.chatapp:id/chat_msg_layout")
            .untilFind()
            .get(i)
        if (uiObject.findOne(id("com.alipay.mobile.chatapp:id/chat_msg_avatar_layout")).bounds().centerX() < WIDTH / 2) {
            let btn = uiObject
                .findOne(text("帮我助力，你也有奖励"));
            sleep(1000 / speed);
            common.clickUiObject(btn);
            sleep(1500 / speed);
            common.clickByText("为Ta助力");
            sleep(1000 / speed);
            back();
        }
    }
    sleep(1500 / speed);
    back();
    sleep(1000 / speed);
    set.push("支付宝助力完成");
    storage.clear();
    storage.put(nowDate, set);
}

function getZfbButtons() {
    return className("android.widget.Button").depth(18).textMatches(/去浏览|去完成|去逛逛/).find();
}

function getButtons() {
    return className("android.widget.Button").clickable().textMatches(/去浏览|去完成|去逛逛/).find();
}

function 每日签到() {
    common.clickByText("我的")
    id("com.alipay.android.phone.wealth.home:id/name").text("🇨🇳🏅+1✨").findOne(2000);
    sleep(2500)
    let img = captureScreen();
    let result = $ocr.detect(img)
    result.forEach((ocr) => {
        if (ocr.label.includes("支付宝会员")) {
            click(ocr.bounds.centerX(), ocr.bounds.centerY())
        }
    })
    sleep(2000);
    common.clickByText("全部领取", 2000)
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
    for (var i = 0; i < 8; i++) {
        let subjectList = textMatches(/\+3|\+1|\+5|\+2/).find();
        if (i >= subjectList.size()) {
            break;
        }
        let subject = subjectList.get(i);
        if (subject) {
            toastLog(subject.text())
            var str = subject.parent().parent().child(1).text();
            toastLog(str)
            if (str.includes("答题")) {
                subject = textMatches(/\+3|\+1/).findOnce(1);
                if (subject == null) {
                    break;
                }
                str = subject.parent().child(0).child(0).text();
            }
            let task_btn = subject.parent().parent().findOne(className("android.widget.Button").text("去完成").clickable());
            if (str.includes("淘金币")) {
                common.clickUiObject(task_btn);
                if (id("android.miui:id/app1").findOne(3000)) {
                    common.clickByText("取消", 1000 / speed);
                }
                sleep(1000 / speed);
                launchApp("支付宝")
            } else if (str.includes("施肥")) {
                common.clickUiObject(task_btn);
                let teskBtn = className("android.widget.Image").depth(16).untilFind().get(1)
                let pointY = teskBtn.bounds().centerY()
                click(540, pointY);
            } else if (str.includes("15") ||
                str === "逛618精选好物会场") {
                common.clickUiObject(task_btn);
                sleep(2000)
                swipe(500, 1700, 500, 1200, 1000);
                sleep(2000)
                swipe(500, 1700, 500, 1100, 8000);
                sleep(2000)
                swipe(500, 1700, 500, 1100, 8000);
                sleep(1000)
            } else if (str.includes("逛天猫")) {
                common.clickUiObject(task_btn);
                sleep(1000 / speed);
                launchApp("支付宝")
                sleep(16000);
            } else if (str === "逛网商双12会场领福利" ||
                str === "逛一逛饿了么冬至会场" ||
                str === "逛蚂蚁庄园喂小鸡" ||
                str === "逛一逛抢10万元免息券") {
                common.clickUiObject(task_btn);
                sleep(2000);
            } else if (str === "逛一逛淘宝芭芭农场") {
                common.clickUiObject(task_btn);
                sleep(5000)
                common.killApp("淘宝");
            } else {
                continue;
            }
            i--;
            sleep(1000 / speed);
            back();
            sleep(1000 / speed)
        }
    }
    swipe(500, 1800, 500, 100, 1000)
    swipe(500, 1800, 500, 100, 1000)
    sleep(18000)
}

function 施肥() {
    sleep(2000 / speed);
    common.clickByText("收下继续施肥", 2000)
    common.clickByText("继续赚肥料", 2000 / speed)
    if (textMatches(/领取|已领取/).exists()) {
        common.clickByText("任务列表");
    }
    sleep(1000 / speed)
    click(540, 1888);
    common.clickByText("立即施肥", 2000)

    let pointX, pointY
    pointX = 540
    pointY = text("任务列表").findOne().bounds.centerY()
    for (let i = 0; i < 200; i++) {
        click(pointX, pointY);
        sleep(500)
        if (text("果树升级啦").exists()) {
            sleep(600)
            common.clickUiObject(text("果树升级啦").findOnce().parent().parent().child(2))
            sleep(600)
        }
        if (text("立即领奖").exists()) {
            sleep(600)
            common.clickByText("立即领奖", 1000)
            sleep(600)
            common.clickByTextMatches(/收下去施肥|立即领取/, 1000)
            sleep(600)
            common.clickByTextMatches(/收下去施肥|立即领取/, 1000)
            sleep(600)
        }
        if (textMatches(/领取|已领取/).exists()) {
            break
        }
    }
    toastLog("施肥完成")
    sleep(1000);
    common.killApp("淘宝")
}
