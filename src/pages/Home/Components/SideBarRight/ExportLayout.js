import React, { useState } from "react";
import { Stack, TextField, Button } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";

import {
  exportComponentAsJPEG,
  exportComponentAsPDF,
  exportComponentAsPNG,
} from "react-component-export-image";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const ExportLayout = ({ componentRef }) => {
  const [exportTypeFile, setExportTypeFile] = useState("png");
  const [fileName, setFileName] = useState("untitled");
  const [openExportList, setOpenExportList] = useState(true);

  const handleExport = () => {
    switch (exportTypeFile) {
      case "png":
        exportComponentAsPNG(componentRef, { fileName: fileName });
        break;
      case "jpg":
        exportComponentAsJPEG(componentRef, { fileName: fileName });
        break;
      case "pdf":
        exportComponentAsPDF(componentRef, { fileName: fileName });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <ListItemButton onClick={() => setOpenExportList(!openExportList)}>
        <ListItemText sx={{ fontWeight: "bold" }} primary="Export Layout" />
      </ListItemButton>
      <Collapse
        in={openExportList}
        timeout="auto"
        unmountOnExit
        sx={{ p: 1, mt: 2 }}
      >
        <Stack direction="row" justifyContent="center" spacing={1} mb={2}>
          <TextField
            value={fileName}
            variant="outlined"
            id="outlined-basic"
            label="file name"
            onChange={(e) => setFileName(e.target.value)}
          />
          <FormControl sx={{ width: "150px" }}>
            <Select
              id="fileExport"
              value={exportTypeFile}
              onChange={(e) => setExportTypeFile(e.target.value)}
              // sx={{ pr: 2, pl: 2 }}
            >
              <MenuItem value={"png"}>png</MenuItem>
              <MenuItem value={"jpg"}>jpg</MenuItem>
              <MenuItem value={"pdf"}>pdf</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Button variant="outlined" onClick={handleExport} fullWidth>
          Export
        </Button>
      </Collapse>
    </>
  );
};

export default ExportLayout;
