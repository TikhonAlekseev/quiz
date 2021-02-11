
var answers = {
    2:null,
    3:null,
    4:null,
    5:null,
}

//Движение вперед

//Мы нашли кнопу с атрибутом data-nav = "next"
var btnNext = document.querySelectorAll('[data-nav="next"]');
//Проходим по всем кнопкам с таким атрибутом
btnNext.forEach(function(button){

    //Отслеживаем действия клика по одной из кнопок
    button.addEventListener('click', function(){
        //Карточка на которой мы нахоидимся
        var thisCard = this.closest('[data-card]');

        //Номер карточки
        var thisCardNumber = parseInt(thisCard.dataset.card)

        if(thisCard.dataset.validate == "novalidate"){
            navigate("next" , thisCard)
            upadateProgressBar("next" , thisCardNumber)


        }else{
            saveAnswer(thisCardNumber , gatherCardDate(thisCardNumber))

            //Проверка на валидацию
            if(isField(thisCardNumber) && checkOnRequired(thisCardNumber)){
                navigate("next" , thisCard)
                upadateProgressBar("next" , thisCardNumber)

            }else{
                alert('Введите данные')
            }
        }
    })
})

//Движение назад
var btnPrev = document.querySelectorAll('[data-nav="prev"]');
btnPrev.forEach(function(button){
    button.addEventListener('click', function(){
        var thisCard = this.closest('[data-card]');
        var thisCardNumber = parseInt(thisCard.dataset.card)

        navigate("prev",thisCard)
        upadateProgressBar("prev", thisCardNumber)

    })
})

// Функция для навигации по карточкам
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

//Функция сбора данных
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

    //Находим все заполненные значения из чекбоксов
        var checkBoxValue = currentCard.querySelectorAll(`[type = "checkbox"]`)
    //Проходим по всем чекбоксам
        checkBoxValue.forEach(function(item){
            if(item.checked){
                result.push({
                    name : item.name,
                    value : item.value
                })
            }
        })

        console.log(result)
        //Находим все значения из инпутов

        var inputValues = currentCard.querySelectorAll(`[type ="text"],[type ="email"],[type ="number"]`)
        inputValues.forEach(function(item){
    //Проходим по всем инпутам
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

//Функция записи данных сответами

function saveAnswer(number , data ){
    answers[number] = data
}

//Функция проверки заполненности

function isField(number){
    if(answers[number].answer.length > 0 ){
        return true
    }else{
        return false
    }
}

//Функция проверки еmail

function validateEmail(email){
    var pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email)
}

//Проверка на заполненность чекбоксов и инпутов с емаил

function checkOnRequired(number){

    //Карточка
    var currentCard = document.querySelector(`[data-card="${number}"]`);

    //Ищем атрибут в карточке
    var requiredFields = currentCard.querySelectorAll("[required]")
    console.log("checkOnRequired -> requiredFields", requiredFields)

    var isValidArray = []



    requiredFields.forEach(function(item){
        console.dir(item.type)
        console.dir(item.value)
        console.dir(item.checked)
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

//Подсвечиваем рамки у радио кнопок

document.querySelectorAll('.radio-group').forEach(function(item){

    item.addEventListener('click' , function(e){
    //Проверяем где был клик
    var label = e.target.closest("label")
        if(label){
            //Отменяем активный класс у других кнопок
            label.closest('.radio-group').querySelectorAll("label").forEach(function(item){
                item.classList.remove("radio-block--active")
            })
            //Добавляем активный класс действующей кнопке

            label.classList.add("radio-block--active")
        }
    })  
})

//Подсвечиваем рамки у радио чекбоксов

document.querySelectorAll(" label.checkbox-block input[type=checkbox]").forEach(function(item){
    item.addEventListener('change', function(){
        if(item.checked){
            item.closest('label').classList.add("checkbox-block--active")
        }else{
            item.closest('label').classList.remove("checkbox-block--active")

        }
    })
})

//Отображение прогресс бара

function upadateProgressBar(direction ,cardNumber){
   var cardsTotalNumber = document.querySelectorAll("[data-card]").length

    //Проверка направления перемещения
   if(direction == "next"){
    cardNumber = cardNumber + 1
    console.log("upadateProgressBar -> cardNumber", cardNumber)
   }else if(direction == "prev"){
    cardNumber = cardNumber - 1
    console.log("upadateProgressBar -> cardNumber", cardNumber)
   }


   //Расчет процента прохождения
   var progress = ((cardNumber * 100)/cardsTotalNumber).toFixed()
   //toFixed(сколько цифр после запятой) убирает цифры после заптяой


   //Находим и обновляем прогресс бар
    var progressBar = document.querySelector(`[data-card="${cardNumber}"]`).querySelector(".progress")

    if(progressBar){
         //Обновляем цифры процентов в размекте
         progressBar.querySelector(".progress__label strong").innerText = `${progress} %`;

        //Обновление линии прогресса
        progressBar.querySelector(".progress__line-bar").style = `width : ${progress}% `;
    }

}