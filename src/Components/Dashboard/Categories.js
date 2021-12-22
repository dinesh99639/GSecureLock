import { Box, Typography } from "@mui/material";

function Categories(props) {
    const { categoriesCount, selectedCategory, updateSelectedCategory } = props;

    return (<>
        <Box className="borderRight" style={{ height: "100%" }} >
            <Box className="borderBottom" style={{ textAlign: "center", padding: "8px 0" }} >Categories</Box>

            <Box>
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
                        <Typography style={{ fontSize: "14px", opacity: 0.7 }} >Total: {category.count}</Typography>
                    </Box>
                })}
            </Box>
        </Box>
    </>);
}

export default Categories;