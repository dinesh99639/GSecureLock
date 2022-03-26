import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Box } from "@mui/material";

function Suggestions(props) {
    const { entryData } = useSelector((state) => state.entries);
    const [suggestions, updateSuggestions] = useState({});

    function checkPasswordStrength(field, password) {
        let strongRegex = new RegExp("^(?=.{14,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
        let mediumRegex = new RegExp("^(?=.{10,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");

        let strength = "";

        if (password.length === 0) {
            strength = "";
        } else if (strongRegex.test(password)) {
            strength = "Strong";
        } else if (mediumRegex.test(password)) {
            strength = "Medium";
        } else {
            strength = "Weak";
        }

        if (strength === "") updateSuggestions({ ...suggestions, [field]: field + " cannot be empty" });
        else updateSuggestions({ ...suggestions, [field]: "Strength of password for the field \"" + field + "\" is " + strength });
    }

    useEffect(() => {
        const data = entryData.data;

        updateSuggestions({});

        if (entryData.category !== "Cards") {
            data.forEach(row => {
                if (row.type === "password") checkPasswordStrength(row.name, row.value);
            });
        }
        else {
            // console.log("card");
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entryData]);

    return (<>
        <Box className="borderBottom" style={{ textAlign: "center", padding: "8px 0" }} >Suggestions</Box>
        <Box>
            <ul style={{ paddingLeft: "25px", margin: "10px 0" }} >
                {Object.keys(suggestions).map((suggestionKey) => {
                    return <li key={suggestionKey} component={"li"}>{suggestions[suggestionKey]}</li>
                })}
            </ul>
        </Box>
    </>);
}

export default Suggestions;