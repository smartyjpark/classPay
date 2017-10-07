import axios from 'axios'

function selectOption(optionClass){
    const delegationTarget = document.querySelector(optionClass);
    delegationTarget.addEventListener('click', (e)=>{
        let target = (e.target.tagName === 'SPAN')? e.target.parentNode : e.target;
        if(!target.classList.contains("option")) return false;
        resetOption('.selected');
        viewPlan('membership-information', target);
        target.classList.add('selected');
    })
}

function resetOption(selectedClass){
    document.querySelectorAll(selectedClass).forEach((item)=>{
        item.classList.remove('selected')
    })
}

function viewPlan(infoClass, target){
    document.querySelector("."+infoClass+"-yes").classList.remove('hide');
    document.querySelector("."+infoClass+"-no").classList.add('hide');
    document.querySelector('.'+infoClass+"-plan").innerHTML = target.innerText;
    document.querySelector("."+infoClass+"-price").innerHTML = target.dataset.price;
}

document.addEventListener("DOMContentLoaded", function(event) {
    selectOption('.option-wrapper');
});

