import { useEffect, useState } from "react"
import { Link } from "react-router";
import "../CardInfo.css"
const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY

const CardInfo = ( {image, id, title} ) => {
    const [calories, setCalories] = useState(0);

    const [proteinDV, setProteinDV] = useState(0);
    const [carbsDV, setCarbsDV] = useState(0);
    const [fatDV, setFatDV] = useState(0);

    // to be used in the extd. info page
    const [protein, setProtein] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [fats, setFats] = useState(0);

    useEffect(() => {
        const fetchNutrition = async () => {
            let query = `https://api.spoonacular.com/recipes/${id}/nutritionWidget.json?apiKey=${API_KEY}`;
            const response = await fetch(query);
            const json = await response.json();

            setCalories(json.calories);

            // making them all into numbers instead of strings
            setProtein(parseFloat(json.protein.replace("g", ""))); 
            setCarbs(parseFloat(json.carbs.replace("g", "")));
            setFats(parseFloat(json.fats.replace("g", "")));

            setProteinDV(json.good[0].percentOfDailyNeeds);
            setCarbsDV(json.bad[3].percentOfDailyNeeds);
            setFatDV(json.bad[1].percentOfDailyNeeds);
        }

        fetchNutrition().catch(console.error);
    }, [id])

    return (
        <div className="card-cntr">
            <img src={image} width={200} height={150}></img>
            <h4> {title} </h4>
            <p className="card-details"> <strong>{calories}</strong> kCal </p>
            <p className="card-details"> <span className="percentages"> {proteinDV}% </span> DV of <em>protein!</em></p>
            <p className="card-details"> <span className="percentages"> {carbsDV}% </span> DV of <em>carbs!</em> </p>
            <p className="card-details"> <span className="percentages"> {fatDV}% </span> DV of <em>fat!</em> </p>
            <Link 
                to={"/" + id}
                state={ {proteinVal: protein, carbsVal: carbs, fatsVal: fats} }
                className="extd-info-card"
                > LEARN MORE! 📖</Link>
        </div>
    )
}
export default CardInfo;