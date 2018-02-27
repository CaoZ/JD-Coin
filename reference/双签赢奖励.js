$(function () {
    countersign.handleClick();
    countersign.shareInit();
});

var countersign = countersign || {};
countersign = {
    shareInit:function () {
        var shareInfo = $("#counterSignShare").val();
        if(shareInfo == ''){
            var title = "一大波京豆、神券、金币等你领取";
            var content = "来京东APP、京东金融APP签到，三重奖励天天领";
            var shareUrl = location.origin + "/countersign/share.action";
            var image = "https://m.360buyimg.com/njmobilecms/jfs/t9763/42/1779781386/15598/ffc609c1/59e80539Nfcb02fe5.png";
            window.jdShare && jdShare.setShareInfo({
                title: title,
                content: content,
                url: shareUrl,
                img : image,
                channel: 'Wxfriends,Wxmoments',
                callback: null,
                clickcallback: null
            });
        }else{
            var activityShare = $.parseJSON(shareInfo);
            window.jdShare && jdShare.setShareInfo({
                title: activityShare.shareTitle,
                content: activityShare.shareContent,
                url: activityShare.shareUrl,
                img : activityShare.shareImage,
                channel: 'Wxfriends,Wxmoments',
                callback: null,
                clickcallback: null
            });
        }


    },
    handleClick: function () {
        //活动规则
        $(".rule-link").on("click",function () {
            createMpingEvent("MJingDouDouble_Rule", "", "", "","JingDou_Double");
            window.location.href="/rulepage/index.action?ruleType=countersign";
        });

        // 打开APP-签到页
        $("#jdSignBtn").on("click", function () {
            createMpingEvent("MJingDouDouble_SignIn", "", "", "","JingDou_Double");
            var link = "https://bean.m.jd.com";
            var url = 'openApp.jdMobile://virtual?params={"sourceType" : "sale-act","sourceValue" : "jumpFromShare","category" : "jump","des" : "DM","dmurl" : "' + link + '"}';
            // var url = $('#jdSignUrl').text();
            if($("#isM").val() == 'true'){
                toJDApp.to(url);
            }else{
                //客户端内部直接openApp
                window.location.href = url;
            }

        });
        //去金融app签到
        $("#jrSignBtn").on("click", function () {
            createMpingEvent("MJingDouDouble_FinancialSignIn", "", "", "","JingDou_Double");
            var url = $('#jrSignUrl').text();
            if (url.indexOf("http") >= 0) {
                window.location.href = url;
            } else {
                toJDApp.to(url);
            }
        });

        $(".oneframe").on("click",function () {
            var event_param = $(this).attr('event_param');
            createMpingEvent("MJingDouHome_ActivityLevelThree1", event_param, "", "","JingDou_Double",3);
            var url = $(this).attr('data-url');
            if (url.indexOf("http") >= 0) {
                window.location.href = url;
            } else {
                if($("#isM").val() == 'true'){
                    toJDApp.to(url);
                }else{
                    //客户端内部直接openApp
                    window.location.href = url;
                }
            }
        });

        $(".twoframe").on("click",function () {
            var event_param = $(this).attr('event_param');
            createMpingEvent("MJingDouHome_ActivityLevelThree2", event_param, "", "","JingDou_Double",3);
            var url = $(this).attr('data-url');
            if (url.indexOf("http") >= 0) {
                window.location.href = url;
            } else {
                if($("#isM").val() == 'true'){
                    toJDApp.to(url);
                }else{
                    //客户端内部直接openApp
                    window.location.href = url;
                }
            }
        });

        $(".gift-dialog-btn").on("click", function () {
            $("#loading").removeClass('hide');
            createMpingEvent("MJingDouDouble_FloatGet", "", "", "","JingDou_Double");
            var html = '<div class="link-gift">立即领取</div>';
            $("#receiveAward").html(html);

            var functionId = 'receiveAward';
            var url = "/countersign/" + functionId + ".json";
            $.ajax({
                type: 'post',
                dataType: "json",
                async: false,
                url: url,
                success: function (resultAjax) {
                    $("#loading").addClass('hide');
                    $("#JGiftDialog").addClass("hide");
                    //领奖流程
                    if (null != resultAjax && null != resultAjax.res && resultAjax.res.code != 0) {
                        //异常流程
                        countersign.processExp(resultAjax);
                    }
                    if (null != resultAjax && null != resultAjax.res && resultAjax.res.code == 0) {
                        var html = '<div class="link-gift">今天已领<span>点击查看礼包</span></div>';
                        $("#receiveAward").html(html);
                        if($("#hasNext").val() == 'true'){
                            $("#tipsNext").show();
                        }
                        //礼包领取成功
                        countersign.getAward(resultAjax);
                    }
                },
                error:function () {
                    $("#loading").addClass('hide');
                    //空礼包
                    var title = "活动太火爆了，稍后再来吧";
                    if($("#hasNext").val() == 'true'){
                        var content = "明天再来噢~";
                    }
                    $.mConfirm({
                        title: title,
                        content:'<p class="text-center">' + content +'</p>',
                        btnWraper: '<span class="confirm-btn">朕知道了</span>',
                        handlerEvent: function (e) {

                        },
                        confirmBack: function (e) {
                            createMpingEvent("MJingDouDouble_Know", "", "", "","JingDou_Double");
                            e.remove();
                        }
                    })
                }
            });
        });

        //领奖
        $("#receiveAward").on("click", function () {
            $("#loading").removeClass('hide');
            createMpingEvent("MJingDouDouble_Get", "", "", "","JingDou_Double");
            var functionId = 'receiveAward';
            // if($("#receiveAward").hasClass("status-disable")){
            //     $("#loading").addClass('hide');
            //     $.mToast({
            //         msg:'完成双签才可领取礼包，快去签到吧</p>',
            //         isDone:false,
            //         time:3000,
            //         callBack: function () {
            //
            //         }
            //     });
            //     return;
            // }
            if ($("#receiveAward").hasClass("status-exception")) {
                $("#loading").addClass('hide');
                $.mToast({
                    msg:'活动太火爆了，稍后再来吧~</p>',
                    isDone:false,
                    time:3000,
                    callBack: function () {
                        location.reload();
                    }
                })
                return;
            }
            if ($("#receiveAward").hasClass('status-viewaward')) {//查看礼包
                functionId = 'queryAward';
            } else if ($("#receiveAward").hasClass('status-toreceive')) {
                functionId = 'receiveAward';
            }
            var url = "/countersign/" + functionId + ".json";

            $.ajax({
                type: 'post',
                dataType: "json",
                async: false,
                url: url,
                success: function (resultAjax) {
                    $("#loading").addClass('hide');
                    if (functionId == 'receiveAward') {
                        //领奖流程
                        if (null != resultAjax && null != resultAjax.res && resultAjax.res.code != 0) {
                            //异常流程
                            countersign.processExp(resultAjax);
                        }
                        if (null != resultAjax && null != resultAjax.res && resultAjax.res.code == 0) {
                            //展示领奖结果
                            var html = '<div class="link-gift">今天已领<span>点击查看礼包</span></div>';
                            $("#receiveAward").html(html);
                            if($("#hasNext").val() == 'true'){
                                $("#tipsNext").show();
                            }
                            countersign.getAward(resultAjax);
                        }

                    }
                    if (functionId == 'queryAward') {
                        //异常流程
                        if (null != resultAjax && null != resultAjax.res && resultAjax.res.code != 0) {
                            //异常流程
                            countersign.processExp(resultAjax);
                        }
                        //查询礼包流程
                        if (null != resultAjax && null != resultAjax.res && resultAjax.res.code == 0) {
                            //已过期


                            //查询礼包成功
                            if (resultAjax.res.data == null) {
                                //空礼包
                                var title = "运气不佳，领到一个空空的礼包；";
                                if($("#hasNext").val() == 'true'){
                                    var content = "明天再来噢~"
                                }
                                $.mConfirm({
                                    title: title,
                                    content:'<p class="text-center">' + content +'</p>',
                                    btnWraper: '<span class="confirm-btn">朕知道了</span>',
                                    handlerEvent: function (e) {

                                    },
                                    confirmBack: function (e) {
                                        createMpingEvent("MJingDouDouble_Know", "", "", "","JingDou_Double");
                                        var html = '<div class="link-gift">今天已签<span>点击查看礼包</span></div>';
                                        $("#receiveAward").removeClass("status-toreceive").addClass("status-viewaward");
                                        $("#receiveAward").html(html);
                                        e.remove();
                                    }
                                })

                            } else {
                                //礼包领取成功
                                if($("#hasNext").val() == 'true'){
                                    $("#tipsNext").show();
                                }
                                countersign.getAward(resultAjax);
                            }

                        }

                    }
                },
                error:function () {
                    $("#loading").addClass('hide');
                    //空礼包
                    var title = "活动太火爆了，稍后再来吧";
                    if($("#hasNext").val() == 'true'){
                        var content = "明天再来噢~";
                    }
                    $.mConfirm({
                        title: title,
                        content:'<p class="text-center">' + content +'</p>',
                        btnWraper: '<span class="confirm-btn">朕知道了</span>',
                        handlerEvent: function (e) {

                        },
                        confirmBack: function (e) {
                            createMpingEvent("MJingDouDouble_Know", "", "", "","JingDou_Double");
                            e.remove();
                        }
                    })
                }
            });
        });
    },
    getAward: function (resultAjax) {
        if (null != resultAjax.res.data) {
            var awardResult = resultAjax.res.data;
            if(awardResult.length == 0){
                //空礼包
                var content = "运气不佳，领到一个空空的礼包";
                $.mConfirm({
                    title: content,
                    btnWraper: '<span class="confirm-btn">朕知道了</span>',
                    handlerEvent: function (e) {

                    },
                    confirmBack: function (e) {
                        createMpingEvent("MJingDouDouble_Know", "", "", "","JingDou_Double");
                        var html = '<div class="link-gift">今天已签<span>点击查看礼包</span></div>';
                        $("#receiveAward").removeClass("status-toreceive").addClass("status-viewaward");
                        $("#receiveAward").html(html);
                        e.remove();
                    }
                });

                return;
            }
            var html = '';
            html += '<div class="cnt-hd">你已领取双签礼包</div>';
            html += '<div class="cnt-bd">';
            for (var i = 0, l = awardResult.length; i < l; i++) {
                html += '<div class="cnt-bd-item align-items">';
                html += ' <div class="item-icon">';
                if (awardResult[i].awardType == 1) {
                    html += '<img src="/images/bean.png" class="bean">';
                }
                if (awardResult[i].awardType == 2) {
                    html += '<img src="/images/gold.png" class="gold">';
                }
                if (awardResult[i].awardType == 3) {
                    html += '<img src="/images/coupon.png" class="coupon">';
                }
                html += '</div>';
                html += '<div class="cell item-desc">';
                if (awardResult[i].awardType == 1 || awardResult[i].awardType == 2) {
                    html += '<p class="item-desc-1">' + awardResult[i].awardName + ' ' + 'x' + awardResult[i].awardCount + ' </p>';
                } else {
                    html += '<p class="item-desc-2">' + awardResult[i].awardName + ' ' + '</p>';
                }

                html += '</div>';
                var linkUrl = awardResult[i].linkUrl;
                if(linkUrl.indexOf("http") < 0){
                    linkUrl =  JSON.stringify(linkUrl).replace(/"/g, '&quot;');
                }
                if(awardResult[i].awardType == 2){//金币拼接sid
                    var sid = resultAjax.sid;
                    html += '<div onclick="countersign.useAward(\'' + linkUrl + sid + '\','+awardResult[i].awardType+')"   class="item-btn useaward">去使用</div>';
                } else{
                    if(linkUrl.indexOf("open") >= 0){
                        //openApp不能重复后引号
                        html += '<div onclick="countersign.useAward(' + linkUrl + ','+awardResult[i].awardType+')"  class="item-btn useaward">去使用</div>';
                    }else{
                        html += '<div onclick="countersign.useAward(\'' + linkUrl + '\','+awardResult[i].awardType+')"  class="item-btn useaward">去使用</div>';
                    }

                }
                html += '</div>';

            }
            html += '</div>';
            if ($("#hasNext").val() == "true") {
                html += '<div class="cnt-tips">记得明天再来哦～</div>';
            }
            html += '<div id="shareSign" onclick="countersign.shareSign()" class="cnt-ft">分享给小伙伴</div>';
            html += '</div>';

            $("#awardInfo").html(html);
            $("#JSignDialog").removeClass("hide");

        }
    },
    processExp: function (resultAjax) {
        if (resultAjax.res.code == 'DS104') {
            //风控用户
            var content = "运气不佳，领到一个空空的礼包";
            $.mConfirm({
                title: content,
                btnWraper: '<span class="confirm-btn">朕知道了</span>',
                handlerEvent: function (e) {

                },
                confirmBack: function (e) {
                    createMpingEvent("MJingDouDouble_Know", "", "", "","JingDou_Double");
                    var html = '<div class="link-gift">今天已签<span>点击查看礼包</span></div>';
                    $("#receiveAward").removeClass("status-toreceive").addClass("status-viewaward");
                    $("#receiveAward").html(html);
                    e.remove();
                }
            })
        } else if (resultAjax.res.code == 'DS103') {
            //活动已结束
            var title = "来晚了，活动已经结束了";
            var content = "去看看其他活动吧~";

            $.mConfirm({
                title: title,
                content:'<p class="text-center">' + content +'</p>',
                btnWraper: '<span class="confirm-btn">朕知道了</span>',
                handlerEvent: function (e) {

                },
                confirmBack: function (e) {
                    createMpingEvent("MJingDouDouble_Know", "", "", "","JingDou_Double");
                    e.remove();
                    var link = "https://bean.m.jd.com";
                    var url = 'openApp.jdMobile://virtual?params={"sourceType" : "sale-act","sourceValue" : "jumpFromShare","category" : "jump","des" : "DM","dmurl" : "' + link + '"}';
                    toJDApp.to(url);
                }
            })
        }else if (resultAjax.res.code == 'DS102') {
            //活动已结束
            var title = "来早了，活动还未开始";
            var content = "去看看其他活动吧~";

            $.mConfirm({
                title: title,
                content:'<p class="text-center">' + content +'</p>',
                btnWraper: '<span class="confirm-btn">朕知道了</span>',
                handlerEvent: function (e) {

                },
                confirmBack: function (e) {
                    createMpingEvent("MJingDouDouble_Know", "", "", "","JingDou_Double");
                    e.remove();
                    var link = "https://bean.m.jd.com";
                    var url = 'openApp.jdMobile://virtual?params={"sourceType" : "sale-act","sourceValue" : "jumpFromShare","category" : "jump","des" : "DM","dmurl" : "' + link + '"}';
                    toJDApp.to(url);
                }
            })
        } else if (resultAjax.res.code == 'DS106') {
            //活动已结束
            var title = "完成双签才可领取礼包";
            var content = "快去签到吧~";
            $.mConfirm({
                title: title,
                content:'<p class="text-center">' + content +'</p>',
                btnWraper: '<span class="confirm-btn">朕知道了</span>',
                handlerEvent: function (e) {

                },
                confirmBack: function (e) {
                    createMpingEvent("MJingDouDouble_Know", "", "", "","JingDou_Double");
                    e.remove();
                    window.location.reload();
                }
            })
        } else {
            //其余异常 当做未领奖处理
            //活动已结束
            var content = "活动太火爆了，稍后再来吧~";
            $.mConfirm({
                title: content,
                btnWraper: '<span class="confirm-btn">朕知道了</span>',
                handlerEvent: function (e) {

                },
                confirmBack: function (e) {
                    createMpingEvent("MJingDouDouble_Know", "", "", "","JingDou_Double");
                    window.location.reload();
                    e.remove();
                }
            })
        }
    },
    useAward: function (url,awardType) {
        var event_id = "";
        var report_lvl = "";
        if(awardType == 1){
            event_id = "MJingDouHome_SKULevelFour1";
            report_lvl  = 4;
        }
        if(awardType == 2){
            event_id = "MJingDouDouble_CoinUse";
        }
        if(awardType == 3){
            event_id = "MJingDouHome_ActivityLevelThree3";
            report_lvl = 3;
        }
        createMpingEvent(event_id, "", "", "","JingDou_Double",report_lvl);
        if (url.indexOf("http") >= 0) {
            window.location.href = url;
        } else {
            if($("#isM").val() == 'true'){
                toJDApp.to(url);
            }else{
                //客户端内部直接openApp
                window.location.href = url;
            }
        }
    },

    shareSign: function () {
        createMpingEvent("MJingDouDouble_Share", "", "", "","JingDou_Double");
        var shareInfo = $("#counterSignShare").val();
        if(shareInfo == ''){
            var shareParam = {
                title: '一大波京豆、神券、金币等你领取',
                content: '来京东APP、京东金融APP签到，三重奖励天天领',
                url: location.origin + '/countersign/index.action',
                img: 'https://m.360buyimg.com/njmobilecms/jfs/t10393/117/1880465648/15598/ffc609c1/59e86165N3494fb59.png',
                channel: 'Wxfriends,Wxmoments,Sinaweibo',
                callback: null,  // 不要依赖回调，不要在回调中加入业务逻辑，不要在回调中处理耗时的操作
                clickcallback:null, // 5.2新增 分享面板中点击分享渠道成功后回调 注意 sendDirectShare 不支持这个回调方法
                qrparam:null, // 具体配置详见 5.2新增 二维码分享
                timeline_title:'' // 5.4新增 朋友圈字段
            }
        }else{
            var activityShare = $.parseJSON(shareInfo);
            var shareParam = {
                title: activityShare.shareTitle,
                content: activityShare.shareContent,
                url: activityShare.shareUrl,
                img: activityShare.shareImage,
                channel: 'Wxfriends,Wxmoments',
                callback: null,  // 不要依赖回调，不要在回调中加入业务逻辑，不要在回调中处理耗时的操作
                clickcallback:null, // 5.2新增 分享面板中点击分享渠道成功后回调 注意 sendDirectShare 不支持这个回调方法
                qrparam:null, // 具体配置详见 5.2新增 二维码分享
                timeline_title:'' // 5.4新增 朋友圈字段
            }
        }
        jdShare.callSharePane(shareParam);
    },


};
