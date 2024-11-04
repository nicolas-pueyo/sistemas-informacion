import React, {useState} from "react";
import { FaStar } from "react-icons/fa"

export default function StarRate({ onRate }) {

    const[rating, setRating] = useState(null)
    const [rateColor, setColor] = useState(null)

    return (

        <>

            {[...Array(5)].map((star, index) => {
                const currentRate = index + 1
                return (

                    <>

                        <label>

                        <input type="radio" name="rate" 
                        value={currentRate}
                        onClick = {() => {
                            setRating(currentRate);
                            onRate(currentRate);          // Llama a la función callback
                        }}
                        />

                        <FaStar size={50}
                        color= { currentRate <= (rateColor || rating) ? "yellow" : "grey" }
                        />

                        </label>

                    </>
                )
            })}
        
        </>
    )
}