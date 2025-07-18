import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import CardInfo from './components/CardInfo'
const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY

const App = () => {
  const [recipeList, setRecipeList] = useState(null);
  const [recipeMacros, setRecipeMacros] = useState({});
  const [amtofRecipes, setAmtOfRecipes] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState(null);

  // fetch macros state variables
  const [count, setCount] = useState(0);
  const [avgProtein, setAvgProtein] = useState(0);
  const [avgCarbs, setAvgCarbs] = useState(0);
  const [avgFat, setAvgFat] = useState(0);

  // placeholder: filter results - if there is something in the search bar, filter accordingly : if not, render the entire list
  const searchMeals = (searchValue) => {
    console.log(searchValue);

    setSearchInput(searchValue); // keeping track if the search bar is filled or not
    if (searchValue !== "") { // if the search is NOT empty
      if (recipeList && recipeList.results) {
        const filteredData = recipeList.results.filter((recipe) => {
          // you need to return the result of the includes check
          return recipe.title
            .toLowerCase()
            .includes(searchValue.toLowerCase());
        });
        console.log(filteredData);
        setFilteredResults(filteredData);
      }
    } else {
      setFilteredResults(recipeList ? recipeList.results : null);
    }

  } 

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const macroFilter = formData.get("macros"); // e.g. "high protein!", "low carb!", etc.
    const searchText = searchInput.toLowerCase();

    if (!recipeList || !recipeList.results) return;

    const filtered = recipeList.results.filter((recipe) => {
      const matchTitle = recipe.title.toLowerCase().includes(searchText);
      const macros = recipeMacros[recipe.id];

      if (!macros) return false;

      let macroMatch = true;

      if (macroFilter === "high protein!") {
        macroMatch = macros.protein > 20;
      } else if (macroFilter === "low carb!") {
        macroMatch = macros.carbs < 30;
      } else if (macroFilter === "low fat!") {
        macroMatch = macros.fat < 10;
      }

      return matchTitle && macroMatch;
    });

    setFilteredResults(filtered);
  };


  // API FETCH: returns LIST of recipes (expected: 10) + set the amount of recipes to the amount generated
  useEffect(() => {
    const fetchRecipeList = async () => {
      let query = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=10`;
      const response = await fetch(query);
      const json = await response.json();

      console.log(json.results.length);

      setAmtOfRecipes(json.results.length);
      setRecipeList(json);
      setFilteredResults(json.results);
    }

    fetchRecipeList().catch(console.error);
  }, []) 

  // API FETCH: returns the macros for a given recipe (protein, carbs, fats) + dynamically sums up the macros of all the recipes in the list
  useEffect(() => {
    const fetchMacros = async () => {
      if (!recipeList || !recipeList.results) return; // if there are no recipes, return nothing

      // temp variables to track the current list of recipes
      let proteinSum = 0;
      let carbsSum = 0;
      let fatSum = 0;
      let localCount = 0;

      for (let recipe of recipeList.results) { // loop through every recipe
        // fetch their macros
        const query = `https://api.spoonacular.com/recipes/${recipe.id}/nutritionWidget.json?apiKey=${API_KEY}`;
        const response = await fetch(query);
        const json = await response.json();

        // to sum up each different macro sum
        proteinSum += parseFloat(json.protein.replace("g", ""));
        carbsSum += parseFloat(json.carbs.replace("g", ""));
        fatSum += parseFloat(json.fat.replace("g", ""));
        localCount += 1;

        // constructing an object for each recipe where key = recipe's id, value(s) = macros
        setRecipeMacros(prev => ({
          ...prev,
          [recipe.id]: {
            protein: parseFloat(json.protein.replace("g", "")),
            carbs: parseFloat(json.carbs.replace("g", "")),
            fat: parseFloat(json.fat.replace("g", ""))
          }
        }));
      }

      // only set state once (after the loop)
      setAvgProtein(proteinSum);
      setAvgCarbs(carbsSum);
      setAvgFat(fatSum);
      setCount(localCount);
    };

    fetchMacros().catch(console.error);
  }, [recipeList]);


  return (
    <div className="main-container">

      <div className="main-panel">
        <div className="graph-cntr">
          {count === amtofRecipes && (
            <div className="charts-wrapper">
              <div>
              <h3><center> Macros per Recipe </center></h3>
                <BarChart
                  data={Object.entries(recipeMacros).map(([id, macros]) => {
                    const recipe = recipeList.results.find(r => r.id === parseInt(id));
                    return {
                      name: recipe?.title || `Recipe ${id}`,
                      protein: macros.protein,
                      carbs: macros.carbs,
                      fat: macros.fat
                    };
                  })}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  width={400} height={250}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="protein" stackId="a" fill="#ffc658" />
                  <Bar dataKey="carbs" stackId="a" fill="#82ca9d" />
                  <Bar dataKey="fat" stackId="a" fill="#8884d8" />
                </BarChart>
                </div>

                <div>
              <h3><center> Average Macro Distribution </center> </h3>
                <PieChart width={400} height={250}>
                  <Pie
                    data={[
                      { name: 'Protein', value: avgProtein },
                      { name: 'Carbs', value: avgCarbs },
                      { name: 'Fat', value: avgFat },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                    dataKey="value"
                  >
                    <Cell fill="#ffc658" />
                    <Cell fill="#82ca9d" />
                    <Cell fill="#8884d8" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
            </div>
            </div>
          )}
        </div>
        
        <div className="summary-cntr">
            <div className="protein-cntr">
                {count === amtofRecipes ? (
                    <p> Average amount of protein: <strong>{avgProtein / count}g</strong> </p>
                ): <p> LOADING... </p>}
            </div>
            <div className="carbs-cntr">
                {count === amtofRecipes ? (
                    <p> Average amount of carbs: <strong>{avgCarbs / count}g</strong> </p>
                ): <p> LOADING... </p>}
            </div>
            <div className="fat-cntr">
                {count === amtofRecipes ? (
                    <p> Average amount of fat: <strong>{avgFat / count}g</strong> </p>
                ): <p> LOADING... </p>}
            </div>
        </div>

        <form onSubmit={handleSubmit} className="form-cntr">
          <input
              type="text"
              placeholder="search for recipes by characters!"
              size="30"
              onChange={(inputString) => searchMeals(inputString.target.value)}
              value={searchInput}
              />

          <input
              type="radio"
              id="protein"
              name="macros"
              value="high protein!"
              />
              <label for="protein">high protein!</label>
          <input
              type="radio"
              id="carbs"
              name="macros"
              value="low carb!"
              /> 
              <label for="carbs">low carb!</label>
          <input
              type="radio"
              id="fats"
              name="macros"
              value="low fat!"
              />
              <label for="fats">low fat!</label>

              <button type="submit"> apply filters! </button>
            </form>

        <div className="display-cntr">
          {filteredResults && filteredResults.map((result) => (
            <CardInfo
              key={result.id}
              image={result.image}
              title={result.title}
              id={result.id}
            />
          ))}
        </div>

      </div>

    </div>
  )
}


export default App
