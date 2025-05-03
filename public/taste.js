document.querySelector('button').addEventListener('click', getRecipe)
document.querySelector('#saveDish').addEventListener('click', saveRecipe)
document.querySelector('#returnProfile').addEventListener('click', () => {
    window.location.href = '/profile';
});
let mealName = document.querySelector('h2')
let mealImage = document.querySelector('img')
let mealSource = document.querySelector('a')


function saveRecipe() {
    axios.put('/saverecipes', {
            name: mealName.innerText,
            img: mealImage.src,
            card: mealSource.href
        })
        .then(res =>{
            const data = res.data
            console.log('Recipe saved', data)
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
    }

function getRecipe() {
    axios.get('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(res => {
            const data = res.data
            console.log(data)
            mealName.innerText = data.meals[0].strMeal
            mealImage.src = data.meals[0].strMealThumb
            mealSource.href = data.meals[0].strSource
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
}
