import { useParams, useLocation } from "react-router"
import { PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, YAxis, Tooltip, Legend } from "recharts"
import { useEffect, useState } from "react"
import DataBox from "../src/components/DataBox"
const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY

const HoverOverBarChart = ( {id, healthData}) => {
    return (
        <div className="hover-over-bar-chart">
            <p> Item {id} </p>
            <p> Health Score: {healthData[0].health_score} </p>
            <h5> (0 - 100% // the higher the percentage, the better!) </h5>
        </div>
    )
}

const ExtraInfo = () => {
    const { id } = useParams();
    const location = useLocation();
    const { proteinVal, carbsVal, fatsVal } = location.state || {};

    const [healthScore, setHealthScore] = useState(0);
    const [recipeName, setRecipeName] = useState('');
    const [credits, setCredits] = useState('');
    const [servings, setServings] = useState(0);
    const [readyin, setReadyIn] = useState(0);
    const [summary, setSummary] = useState('');

    const colors = [
        "#ffc658", // protein color
        "#82ca9d", // carbs color
        "#8884d8", // fats color
    ]

    const healthData = [
        {
            name: `Health Score of Recipe ${id}`,
            health_score: healthScore
        }
    ]

    const macroData = [
        { name: 'protein', value: proteinVal},
        { name: 'carbs', value: carbsVal},
        { name: 'fats', value: fatsVal}
    ]

    // nerd math to display percentages on the pie chart
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
        const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${((percent ?? 1) * 100).toFixed(0)}%`}
            </text>
        );
    };

    // API call to get additional information about the item that was clicked
    useEffect(() => {
        const fetchExtraInfo = async () => {
            let query = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`;
            const response = await fetch(query); 
            const json = await response.json();

            console.log(json);

            setRecipeName(json.title);
            setCredits(json.creditsText);
            setHealthScore(json.healthScore);

            setServings(json.servings);
            setReadyIn(json.readyInMinutes);
            setSummary(json.summary);
        }

        fetchExtraInfo().catch(console.error);
    }, [id])
     
    return (
        <div className="main-panel">

            <div className="recipe-panel">
                <div className="recipe-info">
                    <h3> {recipeName} </h3>
                    <p> recipe from <strong> {credits} </strong> </p>

                    <br></br>

                    <DataBox lbl1="Protein" lbl2="Carbs" lbl3="Fats" attr1={proteinVal} attr2={carbsVal} attr3={fatsVal} />
                    <DataBox lbl1="Amount of servings" lbl2="Prep time (in minutes)" attr1={servings} attr2={readyin} />

                </div>

                <div className="info-panel">
                    
                    <BarChart
                        width={250}
                        height={300}
                        data={healthData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        barSize={50}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                        <YAxis type="number" domain={[0, 100]}/>
                        <Tooltip cursor={false} content={<HoverOverBarChart id={id} healthData={healthData}/>}/>
                        <Legend />
                        <Bar dataKey="health_score" fill="#36432f" />
                        <defs>
                            <linearGradient id="colorHealthScore" x1='0' y1='0' x2="100%" y2="0" spreadMethod="reflect">
                                <stop offset='0' stopColor="#BF0A30" />
                                <stop offset='1' stopColor="#008000" />
                            </linearGradient>
                        </defs>
                    </BarChart>

                    <PieChart width={250} height={250}>
                        <Pie
                        data={macroData}
                        cx="50%"
                        cy="50%"
                        label={renderCustomizedLabel}
                        labelLine={false}
                        outerRadius={80}
                        fill="#000000"
                        dataKey="value"
                        >
                        {macroData.map((entry, index) => (
                            <Cell key={`cell-${entry.name}`} fill={colors[index % colors.length]}/>
                        ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </div>

            </div>

        </div>
    )
}

export default ExtraInfo