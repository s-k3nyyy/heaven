import '../App.css';
import { CircularProgress } from "@mui/material";

function LoadingPage () {
    return(
        <div className="loading-container">
            <CircularProgress sx={{ color: '#C4B1CF'}} size={50} />
            <p>Loading your page 💜...</p>
        </div>
    )
}

export default LoadingPage