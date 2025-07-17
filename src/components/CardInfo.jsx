import { useEffect, useState } from "react"
import "../CardInfo.css"
const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY

const CardInfo = ( {image, id, title} ) => {
    const [calories, setCalories] = useState(0);
    const [proteinDV, setProteinDV] = useState(0);
    const [carbsDV, setCarbsDV] = useState(0);
    const [fatDV, setFatDV] = useState(0);

    useEffect(() => {
        const fetchNutrition = async () => {
            let query = `https://api.spoonacular.com/recipes/${id}/nutritionWidget.json?apiKey=${API_KEY}`;
            const response = await fetch(query);
            const json = await response.json();

            setCalories(json.calories);
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
        </div>
    )
}
export default CardInfo;