import { Outlet, Link } from "react-router"
import { useState } from "react"

const Layout = () => {
    const [number, setNumber] = useState(5);

    return (
        <div className="main-container">
            <div className="nav-panel">
                <h2> Recipe Retriever! 📖 </h2>
                <p> 
                Search, filter and learn about your favorite foods or foods you've never heard of before!
                </p>
                <p className="add-info"> 
                CREDITS: spoonacular API 
                </p>
                <Link to="/" className="nav-buttons"> HOME! 🏡 </Link>
                <p className="add-info mark"> 
                DV (daily value) refers to the recommended daily intake based on the average human, will vary depending on your body ** 
                </p>
                
            </div>

            <Outlet />
     </div>
    )
}

export default Layout