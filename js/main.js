
var answers = {
    2:null,
    3:null,
    4:null,
    5:null,
}

var btnNext = document.querySelectorAll('[data-nav="next"]');

btnNext.forEach(function(button){

    button.addEventListener('click', function(){
       
        var thisCard = this.closest('[data-card]');

        var thisCardNumber = parseInt(thisCard.dataset.card)

        if(thisCard.dataset.validate == "novalidate"){
            navigate("next" , thisCard)
            upadateProgressBar("next" , thisCardNumber)

        }else{
            saveAnswer(thisCardNumber , gatherCardDate(thisCardNumber))

            if(isField(thisCardNumber) && checkOnRequired(thisCardNumber)){
                navigate("next" , thisCard)
                upadateProgressBar("next" , thisCardNumber)

            }else{
                alert('Введите данные')
            }
        }
    })
})


var btnPrev = document.querySelectorAll('[data-nav="prev"]');
btnPrev.forEach(function(button){
    button.addEventListener('click', function(){
        var thisCard = this.closest('[data-card]');
        var thisCardNumber = parseInt(thisCard.dataset.card)
        navigate("prev",thisCard)
        upadateProgressBar("prev", thisCardNumber)
    })
})

function navigate(direction , thisCard){

    var thisCardNumber = parseInt(thisCard.dataset.card) ;

    if(direction == "next"){
        var nextCard = thisCardNumber + 1;
    }else if(direction == "prev"){
        var nextCard = thisCardNumber - 1;
    }

    thisCard.classList.add('hidden');

    document.querySelector(`[data-card = "${nextCard}"]`).classList.remove('hidden')
    
}


function gatherCardDate(number){

        var result = [];

        var currentCard = document.querySelector(`[data-card = "${number}"]`)

        var question = currentCard.querySelector("[data-question]").innerText  ;

        var radioValues = currentCard.querySelectorAll('[type = "radio"] ')

        radioValues.forEach(function(radio){

            if(radio.checked){
                result.push({
                    name : radio.name,
                    value : radio.value
                })
            }
        })

        var checkBoxValue = currentCard.querySelectorAll(`[type = "checkbox"]`)

        checkBoxValue.forEach(function(item){
            if(item.checked){
                result.push({
                    name : item.name,
                    value : item.value
                })
            }
        })

        var inputValues = currentCard.querySelectorAll(`[type ="text"],[type ="email"],[type ="number"]`)
        inputValues.forEach(function(item){

            itemValue = item.value
            if(itemValue.trim() != ""){
                result.push({
                    name : item.name,
                    value : item.value
                })
            }
        })

        var data = {
            question : question,
            answer : result
        }
        
    return data

}

function saveAnswer(number , data ){
    answers[number] = data
}

function isField(number){
    if(answers[number].answer.length > 0 ){
        return true
    }else{
        return false
    }
}

function validateEmail(email){
    var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email)
}

function checkOnRequired(number){

    var currentCard = document.querySelector(`[data-card="${number}"]`);

    var requiredFields = currentCard.querySelectorAll("[required]")

    var isValidArray = []
    requiredFields.forEach(function(item){
        if(item.type =="checkbox" && item.checked == false) {
            isValidArray.push(false)
        }else if(item.type =="email"){
            if(validateEmail(item.value)){
                isValidArray.push(true)
            }else{
                isValidArray.push(false)
            }
        }
    })
    if(isValidArray.indexOf(false) == -1){
        return true
    }else{
        return false
    }
}

document.querySelectorAll('.radio-group').forEach(function(item){

    item.addEventListener('click' , function(e){

    var label = e.target.closest("label")
        if(label){
            label.closest('.radio-group').querySelectorAll("label").forEach(function(item){
                item.classList.remove("radio-block--active")
            })
            label.classList.add("radio-block--active")
        }
    })  
})

document.querySelectorAll(" label.checkbox-block input[type=checkbox]").forEach(function(item){
    item.addEventListener('change', function(){
        if(item.checked){
            item.closest('label').classList.add("checkbox-block--active")
        }else{
            item.closest('label').classList.remove("checkbox-block--active")

        }
    })
})

function upadateProgressBar(direction ,cardNumber){
   var cardsTotalNumber = document.querySelectorAll("[data-card]").length

   if(direction == "next"){
    cardNumber = cardNumber + 1
   }else if(direction == "prev"){
    cardNumber = cardNumber - 1
   }

   var progress = ((cardNumber * 100)/cardsTotalNumber).toFixed()

    var progressBar = document.querySelector(`[data-card="${cardNumber}"]`).querySelector(".progress")

    if(progressBar){
         
         progressBar.querySelector(".progress__label strong").innerText = `${progress} %`;

      
        progressBar.querySelector(".progress__line-bar").style = `width : ${progress}% `;
    }

}