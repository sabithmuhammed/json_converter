import { useState } from "react";
import { 
  Container, 
  Grid, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  IconButton,
  Snackbar,
  Checkbox,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import CodeEditor from "@uiw/react-textarea-code-editor";

interface PairType {
  key: string;
  value: string;
  enabled: boolean;
}

export default function Form() {
    const [code, setCode] = useState(`{\n}`);
    const [pairs, setPairs] = useState<PairType[]>([
        { key: "", value: "", enabled: true },
    ]);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCode = (pairsArray: PairType[]): void => {
        let codeObject: { [key: string]: string | number } = {};
      
        pairsArray.forEach((pair) => {
          if (pair.enabled) {
            const key = pair.key || "";
            let value: string | number = pair.value || "";
        
            const numberRegex = /^-?[0-9][0-9,.]*$/;
            if (numberRegex.test(value)) {
              value = parseFloat(value.replace(',', '.'));
            }
        
            codeObject[key] = value;
          }
        });
      
        const codeString = JSON.stringify(codeObject, null, 2);
        setCode(codeString);
    };

    const handleInput = (
        index: number,
        value: string,
        type: "key" | "value"
    ) => {
        const newPairs = pairs.map((pair, i) => {
            if (i === index) {
                return { ...pair, [type]: value };
            }
            return pair;
        });

        setPairs(newPairs);
        handleCode(newPairs);
    };

    const addNewPair = () => {
        setPairs([...pairs, { key: "", value: "", enabled: true }]);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code).then(() => {
            setOpenSnackbar(true);
        });
    };

    const toggleField = (index: number) => {
        const newPairs = pairs.map((pair, i) => 
            i === index ? { ...pair, enabled: !pair.enabled } : pair
        );
        setPairs(newPairs);
        handleCode(newPairs);
    };

    const deleteField = (index: number) => {
        const newPairs = pairs.filter((_, i) => i !== index);
        setPairs(newPairs);
        handleCode(newPairs);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                JSON Generator
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                        {pairs.map((pair, index) => (
                            <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
                                <Grid item xs={1}>
                                    <Checkbox
                                        checked={pair.enabled}
                                        onChange={() => toggleField(index)}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Key"
                                        variant="outlined"
                                        value={pair.key}
                                        onChange={(e) => handleInput(index, e.target.value, "key")}
                                        disabled={!pair.enabled}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Value"
                                        variant="outlined"
                                        value={pair.value}
                                        onChange={(e) => handleInput(index, e.target.value, "value")}
                                        onKeyUp={(e) => {
                                            if (e.key === "Enter") {
                                                addNewPair();
                                            }
                                        }}
                                        disabled={!pair.enabled}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <IconButton onClick={() => deleteField(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={addNewPair}
                        >
                            Add Field
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2, position: 'relative' }}>
                        <CodeEditor
                            value={code}
                            language="json"
                            onChange={(evn) => setCode(evn.target.value)}
                            padding={15}
                            style={{
                                fontSize: 12,
                                fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                                minHeight: '300px'
                            }}
                        />
                        <IconButton 
                            onClick={copyToClipboard}
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                        >
                            <ContentCopyIcon />
                        </IconButton>
                    </Paper>
                </Grid>
            </Grid>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={() => setOpenSnackbar(false)}
                message="JSON copied to clipboard"
            />
        </Container>
    );
}