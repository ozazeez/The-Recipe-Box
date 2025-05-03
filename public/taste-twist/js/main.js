const { method } = require("lodash")

document.querySelector('button').addEventListener('click', getRecipe)
document.querySelector('.saveDish').addEventListener('click', saveRecipe)
let mealName = document.querySelector('h2')
let mealImage = document.querySelector('img')
let mealSource = document.querySelector('a')


function saveRecipe() {
    fetch('saverecipes', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: mealName.innerText,
            img: mealImage.src,
            card: mealSource.href
        })
    }
    )

        // .then(res => res.json())
        // .then(data => {
        //     console.log(data)
        //     mealName.innerText = data.meals[0].strMeal
        //     mealImage.src = data.meals[0].strMealThumb
        //     mealSource.href = data.meals[0].strSource
        // })
        .catch(err => {
            console.log(`error ${err}`)
        })
}

function getRecipe() {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(res => res.json())
        .then(data => {
            console.log(data)
            mealName.innerText = data.meals[0].strMeal
            mealImage.src = data.meals[0].strMealThumb
            mealSource.href = data.meals[0].strSource
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
}
