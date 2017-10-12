const axios = require('axios');

emailjs.init("user_iGQ8hGGPREMvZY1u4Pgg5");

function selectOption(optionClass) {
    const delegationTarget = document.querySelector(optionClass);
    delegationTarget.addEventListener('click', (e) => {
        let target = (e.target.tagName === 'SPAN') ? e.target.parentNode : e.target;
        if (!target.classList.contains("option")) return false;
        resetOption();
        viewPlan('membership-information', target);
        target.classList.add('selected');
    })
}

function resetOption() {
    document.querySelectorAll('.selected').forEach((item) => {
        if (item.classList.contains('selected')) {
            item.classList.remove('selected')
        }
    })
}

function viewPlan(infoClass, target) {
    document.querySelector("." + infoClass + "-yes").classList.remove('hide');
    document.querySelector("." + infoClass + "-no").classList.add('hide');
    document.querySelector('.' + infoClass + "-plan").innerHTML = target.innerText;
    document.querySelector("." + infoClass + "-price").innerHTML = target.dataset.price;
}

function getToken() {
    axios.post('/token')
}

function resetValue() {
    document.querySelectorAll('input').forEach((ele) => {
        ele.value = "";
    })
}

function pageChange() {
    document.querySelector('.menu-bar').addEventListener('click', (e) => {
        const target = e.target;
        if (!target.classList.contains('menu-option')) return false;
        document.querySelector('.menu-option.menu-selected').classList.remove('menu-selected')
        target.classList.add('menu-selected');
        document.querySelector('.content.display-on').classList.remove('display-on');
        document.querySelector('.navigation-bar-label.nav-on').classList.remove('nav-on')
        const content = target.dataset.page;
        const title = target.dataset.title;
        document.querySelector('.' + title).classList.add('nav-on');
        document.querySelector('.' + content).classList.add('display-on');
        menuOff();
        layerOff();
        resetValue();
        if (document.querySelector('.option.selected')) document.querySelector('.option.selected').classList.remove('selected');
    });
}

function menuOn() {
    document.querySelector('.menu-img').addEventListener('click', () => {
        document.querySelector('.menu-bar').classList.add('menu-on');
        layerOn();
    })
}

function menuOff() {
    document.querySelector('.menu-bar').classList.remove('menu-on')
    layerOff()
}

function layerOn() {
    document.querySelector('.layer').classList.add('on')
}

function layerOff() {
    document.querySelector('.layer').classList.remove('on')
}

function layerEvent() {
    document.querySelector('.layer').addEventListener('click', () => {
        menuOff()
    })
}

function pay() {
    if (!document.querySelector('.option.selected')) {
        alert("멤버십을 먼저 선택하세요!");
        window.scrollTo(0, 0);
        return false;
    }
    let payObj = {};
    payObj.merchant_uid = "classPay_" + new Date().getTime();
    payObj.buyer_email = document.getElementById('pay-email').value;
    payObj.buyer_tel = document.getElementById('pay-phone').value;
    payObj.name = document.querySelector(".option.selected").innerText;
    payObj.amount = document.querySelector(".option.selected").dataset.amount;
    payObj.buyer_name = document.getElementById('pay-name').value;
    payObj.card_number = document.getElementById('pay-card').value;
    payObj.expiry = '20' + document.getElementById('pay-due').value.slice(0, 2) + '-' + document.getElementById('pay-due').value.slice(2, 4);
    payObj.birth = document.getElementById('pay-birth').value;
    payObj['pwd_2digit'] = document.getElementById('pay-pw').value;
    if (formChecker('pay')) axios.post('/pay', payObj)
        .then((res) => {
            console.log(res)
            console.log("------")
            console.log(res.data)
            if (res.data.code === 0) {
                alert('결제에 성공하였습니다. 해당 이메일로 결제정보가 전송됩니다. \n[주문번호]: ' + payObj.merchant_uid
                    + "\n[고객명]: " + payObj.buyer_name
                    + "\n[상품명]: " + payObj.name
                    + "\n[이메일]: " + payObj.buyer_email
                    + "\n[결제카드]: " + payObj.card_number.slice(0,12)+"****");

                resetValue()
                resetOption()
                sendMail(payObj, "결제")
            } else {
                alert("결제에 실패하셧습니다. " + res.data.message);
                resetValue()
                resetOption()
            }
        })
}

function refund() {
    let refundObj = {}
    refundObj.merchant_uid = document.getElementById('refund-uid').value;
    refundObj.buyer_name = document.getElementById('refund-name').value;
    refundObj.buyer_email = document.getElementById('refund-email').value;
    if (formChecker('refund')) axios.post('/refund', refundObj)
        .then((res) => {
            if (res.data.code === 0) {
                alert("환불이 완료되었습니다. 이메일로 환불정보가 전송됩니다.");
                resetValue();
                resetOption();
                sendMail(res.data.response, "환불")
            } else {
                console.log(res.data);
                alert("환불에 실패하셧습니다. " + res.data);
                resetValue();
                resetOption();
            }
        })
        .catch((error) => {
            alert(error)
        })

}

function sendMail(obj, payOrRefund) {
    emailjs.send("gmail", "template_Ju4Ld", {
        "to_email": obj.buyer_email,
        "from_name": "classting",
        "from_mail": "classting@classting.com",
        "reply_to": "classting@classting.com",
        "user_name": obj.buyer_name,
        "pay_or_refund": payOrRefund,
        "service_name": obj.name,
        "service_price": obj.amount,
        "uid": obj.merchant_uid
    })
        .then(
            (response) => {
                console.log("SUCCESS", response);
            },
            (error) => {
                console.log("FAILED", error);
            }
        )
}

function payEvent() {
    document.querySelector('.submit-btn').addEventListener('click', () => {
        pay()
    })
}

function refundEvent() {
    document.querySelector('.refund-btn').addEventListener('click', () => {
        refund()
    })
}

function modalOn() {
    if (!document.querySelector('.modal-on')) {
        document.querySelector('.modal').classList.add('modal-on')
    }
}

function modalOff() {
    if (document.querySelector('.modal-on')) {
        document.querySelector('.modal').classList.remove('modal-on')
    }
}

function modalOffEvent() {
    document.querySelector('.modal > span').addEventListener('click', (e) => {
        modalOff()
    })
}

//입력 폼 관련 이벤트

function onlyNumber(str) {
    str = str.replace(/[^0-9]/g, '')
    return str;
}

function autoPhoneNumber(str) {
    str = str.replace(/[^0-9]/g, '')
    let tmp = '';
    if (str.length < 4) {
        return str;
    } else if (str.length < 7) {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3);
        return tmp;
    } else if (str.length < 11) {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 3);
        tmp += '-';
        tmp += str.substr(6);
        return tmp;
    } else {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 4);
        tmp += '-';
        tmp += str.substr(7);
        return tmp;
    }
    return str;
}

function autoPhoneNumberEvent() {
    const phone = document.getElementById('pay-phone');
    phone.onkeyup = function (event) {
        event = event || window.event;
        let _val = this.value.trim();
        this.value = autoPhoneNumber(_val);
    }
}

function autoNumberEvent(id) {
    const card = document.getElementById(id);
    card.onkeyup = function (event) {
        event = event || window.event;
        let _val = this.value.trim();
        this.value = onlyNumber(_val);
    }
}

//form 입력 체커

function formChecker(payOrRefund) {
    let text = ""
    document.querySelectorAll('.input-' + payOrRefund).forEach((ele) => {
        if (!ele.value) {
            text += ele.parentNode.innerText
        }
    })
    if (text === "") {
        return true;
    } else {
        alert(text + "양식이 채워지지 않았습니다")
        return false;
    }
}

function optionSelectChecker() {
    document.querySelectorAll('.input-pay').forEach((ele) => {
        ele.addEventListener('click', () => {
            if (!document.querySelector('.option.selected')) {
                alert("멤버십을 먼저 선택하세요!");
                window.scrollTo(0, 0);
                ele.blur();
            }
        })
    })
}

document.addEventListener("DOMContentLoaded", () => {
    getToken();
    selectOption('.option-wrapper');
    payEvent();
    menuOn();
    layerEvent();
    pageChange();
    refundEvent();
    modalOffEvent();
    autoPhoneNumberEvent();
    optionSelectChecker();
    autoNumberEvent('pay-card');
    autoNumberEvent('pay-due');
    autoNumberEvent('pay-birth');
});