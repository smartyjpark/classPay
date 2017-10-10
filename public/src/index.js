import axios from 'axios'
const config = require('../../config');


let token;

function selectOption(optionClass) {
    const delegationTarget = document.querySelector(optionClass);
    delegationTarget.addEventListener('click', (e) => {
        let target = (e.target.tagName === 'SPAN') ? e.target.parentNode : e.target;
        if (!target.classList.contains("option")) return false;
        resetOption('.selected');
        viewPlan('membership-information', target);
        target.classList.add('selected');
    })
}

function resetOption(selectedClass) {
    document.querySelectorAll(selectedClass).forEach((item) => {
        item.classList.remove('selected')
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
        .then(function (response) {
            token = response.data['access_token'];
            console.log(token)
        });
}

function pay() {
    let payObj = {};
    payObj['merchant_uid'] = "classPay_" + new Date().getTime();
    payObj.name = document.querySelector(".option.selected").innerText;
    payObj.amount = document.querySelector(".option.selected").dataset.amount;
    payObj.buyer_name = document.getElementById('pay-name').value;
    payObj.card_number = document.getElementById('pay-card').value;
    payObj.expiry = document.getElementById('pay-due').value;
    payObj.birth = document.getElementById('pay-birth').value;
    payObj['pwd_2digit'] = document.getElementById('pay-pw').value;
    axios.post('/pay', payObj)
        .then(function(res){
            console.log(res)
        })
}

function payEvent() {
    document.querySelector('.submit-btn').addEventListener('click', ()=>{
        pay()
    })
}

document.addEventListener("DOMContentLoaded", () => {
    getToken();
    selectOption('.option-wrapper');
    payEvent()
});