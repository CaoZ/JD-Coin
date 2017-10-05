
/*  弹层的使用方法*/
var popUp = null;
seajs.use('financial/common/module/popup/1.0.0/js/popup', function(popup){
    popUp = popup;
});

$(function() {//加载广告资源
    $.post("/newSign/getSignAd", function(data){
        if(data!=null){
             var signAdData = data.signAdData;
             var signAdContent = data.signAdContent;
            $("[name=advertName]").attr("href",signAdData.toUrl);
            $(".promotion-img").css("background-image",'url('+signAdData.imageUrl+')');
            $("#logUrl").val(signAdData.logUrl);
            $(".promotion-name").text(signAdContent.title);
            $(".promotion-subName").text(signAdContent.ext1);
        }
    });
});

$('.modal-close').click(function(){
    popUp.hideLayer($('.sign-box'));
    $(".sign-box").removeClass("view-rule");
    window.location.href="/";
});

/*签到翻转*/
$(".sign-text a").on("click",function(){
    $(".sign-box").addClass("view-rule");
});
$(".sign-btn a").on("click",function(){
    $(".sign-box").removeClass("view-rule");
});

$("#iknowbtn").on("click",function() {
    popUp.hideLayer($('.sign-box'));
    window.location.href="/";
});
//点击签到
$('#index-qian-btn,#img-box').click(function(){
    doSign();//签到
});

// 执行签到
function doSign(){
    $.post("/newSign/doSign", function(result){
        if(result.signSuccess == true) {//调用成功
            var resBusiCode = result.resBusiCode;
            var signResData = result.signResData;
            makeSignPopup(resBusiCode,signResData);
            popUp.showLayer($('.sign-box'));
        }else {
            makeSignPopup(9999,null);
            popUp.showLayer($('.sign-box'));
        }
    });
    var logUrl = $("#logUrl").val();
    if(logUrl!=null && logUrl!=""){
        //请求广告播放日志
        $.ajax({
            type:"get",
            url:logUrl,
            dataType:"jsonp",
            success:function(){
            }
        });
    }
}

function makeSignPopup(resBusiCode,signResData){//1正常2异常
    if(resBusiCode==9999||resBusiCode==null){
        var signTitle = "签到失败";
        var signSubtitle = "请稍后再试";
        var signContinuity = "";
    }else if(resBusiCode!=null){
        var  signTitle = "签到失败";
        var  signSubtitle = "";
        var  signContinuity = "";
        var  getRewardText = "";
        var  unit = "奖励";

        if(signResData!=null){
            if(signResData.rewardType==1){
                 unit = "京豆";
                var thisAmount = signResData.thisAmount;//本次发放奖励
            }else if(signResData.rewardType==2){
                 unit = "金币";
                var thisAmount = signResData.thisAmount;//本次发放奖励
            }else if(signResData.rewardType==3){
                 unit = "钢镚";
                var thisAmount = signResData.thisAmount * 0.01;//本次发放奖励
            }
            getRewardText = "获得"+thisAmount+unit;

            var day = signResData.continuityDays;//连续签到天数
            for(var i=1;i<=day&&i<=7;i++){
                $("#day"+i).addClass("active");
            }
            signContinuity = "已连续签到"+day+"天，连续7天有惊喜哟";
        }

        if(resBusiCode == 0){
            signTitle = "签到成功";
            signSubtitle = getRewardText;

        }else if(resBusiCode == 13){
            signTitle = "很遗憾";
            signSubtitle = "签到未获得奖励";

        }else if(resBusiCode == 14){
            signTitle = "签到成功";
            signSubtitle = unit+"20天内到账";

        }else if(resBusiCode == 15){
            signTitle = "已签到";
            signSubtitle = getRewardText;

        }else if(resBusiCode == 16){
            signTitle = "已签到";
            signSubtitle = getRewardText;
        }else if(resBusiCode == 17){
            signTitle = "签到失败";
            signSubtitle = "请完善信息";

        }else if(resBusiCode == 18){
            signTitle = "已签到";
            signSubtitle = getRewardText;

        }else if(resBusiCode == 19){
            signTitle = "签到成功";
            signSubtitle = unit+"20天内到账";
        }else if(resBusiCode == 20){
            signTitle = "签到失败";
            signSubtitle = "请完成实名认证";
        }

    }
    $("#signFlag").text(signTitle);
    $("#getRewardText").text(signSubtitle);
    $("#signContinuity").text(signContinuity);
}


