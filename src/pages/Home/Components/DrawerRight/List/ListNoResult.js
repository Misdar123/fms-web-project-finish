import React from "react";
import { Container } from "@mui/system";
import { Stack, Typography } from "@mui/material";
import SummarizeIcon from "@mui/icons-material/Summarize";


const ListNoResult = ({title}) => {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100px",
      }}
    >
      <Stack direction="row">
        <SummarizeIcon sx={{ color: "gray" }} />
        <Typography color="gray">{title}</Typography>
      </Stack>
    </Container>
  );
};


export default ListNoResult