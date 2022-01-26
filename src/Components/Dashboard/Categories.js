import { useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { Box, Typography } from "@mui/material";

function Categories(props) {
    const dispatch = useDispatch();

    const { selectedCategory, categoriesCount } = useSelector((state) => state.entries);
    const updateSelectedCategory = useCallback((selectedCategory) => dispatch({ type: "updateSelectedCategory", payload: { selectedCategory } }), [dispatch]);

    return (<>
        <Box className="borderRight" style={{ height: "100%" }} >
            <Box className="borderBottom" style={{ textAlign: "center", padding: "8px 0" }} >Categories</Box>

            <Box style={{ overflowY: "auto", height: "87vh" }} >
                {categoriesCount.map((category) => {
                    return <Box
                        key={category.name}
                        className="borderBottom"
                        style={{
                            margin: "0 2px",
                            padding: "5px 10px",
                            cursor: "pointer",
                            borderRadius: "4px",
                            backgroundColor: (selectedCategory === category.name) ? "rgb(0, 136, 253)" : null,
                            color: (selectedCategory === category.name) ? "white" : "inherit",
                        }}
                        onClick={() => updateSelectedCategory(category.name)}
                    >
                        <Typography style={{ fontSize: "16px", overflow: "none" }} >{category.name}</Typography>
                        <Typography style={{ fontSize: "14px", opacity: 0.76 }} >Total: {category.count}</Typography>
                    </Box>
                })}
            </Box>
        </Box>
    </>);
}

export default Categories;