import { useParams, useLocation } from "react-router"
import { PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { useEffect } from "react"
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
    let { id } = useParams();
    const location = useLocation();
    const { proteinVal, carbsVal, fatsVal } = location.state || {};

    const colors = [
        "#ebb513", // protein color
        "#13c7eb", // carbs color
        "#ad13eb", // fats color
    ]

    let healthData = [
        {
            name: `Health Score of Recipe ${id}`,
            health_score: 80
        }
    ]

    let macroData = [
        { name: 'protein', value: proteinVal},
        { name: 'carbs', value: carbsVal},
        { name: 'fats', value: fatsVal}
    ]

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

    useEffect(() => {
        const fetchExtraInfo = async () => {

        }

        fetchExtraInfo().catch(console.error);
    }, [])
     
    return (
        <div className="main-panel">

            <div className="recipe-panel">
                <div className="recipe-info">
                    <p> EXTRA INFO PAGE {id} </p>
                    <p> FILLER </p>

                    <br></br>

                    <table className="attr-table">
                        <tr>
                            <th> Protein: </th>
                            <td> {proteinVal} </td>
                        </tr>
                        <tr>
                            <th> Carbs: </th>
                            <td> {carbsVal} </td>
                        </tr>
                        <tr>
                            <th> Fats: </th>
                            <td> {fatsVal} </td>
                        </tr>
                    </table>

                </div>

                <div className="info-panel">

                    <BarChart
                        width={500}
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
                    </BarChart>

                    <PieChart width={500} height={250}>
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
                            <Cell key={`cell-${entry.name}`} fill={colors[index % colors.length]} />
                        ))}
                        </Pie>
                    </PieChart>
                </div>

            </div>

        </div>
    )
}

export default ExtraInfo