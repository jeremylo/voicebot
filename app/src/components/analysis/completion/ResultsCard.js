import { Card, CardHeader, Divider, makeStyles, Typography } from "@material-ui/core";
import MicIcon from '@material-ui/icons/Mic';
import { sputumColours } from "../Sputum";

const useStyles = makeStyles((theme) => ({
    resultsCard: {
        marginBottom: '1rem'
    }
}));

export default function ResultsCard({ results, tests }) {
    const classes = useStyles();

    return (
        <Card variant="outlined" className={classes.resultsCard}>
            <CardHeader
                avatar={<MicIcon />}
                title={`${tests[results.testId].title} (${results["speech.duration"]}s)`}
                subheader={new Date(results.createdAt).toLocaleString()}
            />
            <Divider />
            <div style={{ padding: '16px' }}>
                <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Syllables per minute</strong>: {results['speech.syllablesPerMinute']} <br />
                    {results.sputum && <><strong>Sputum colour</strong>: {sputumColours.find(x => x.value === results.sputum).name.toLowerCase()}<br /></>}
                    {results.wellbeing && <><strong>Wellbeing</strong>: {results.wellbeing} / 10<br /></>}
                    {results.dyspnoea && <><strong>MRC dyspnoea score</strong>: {results.dyspnoea}<br /></>}
                </Typography>
            </div>
        </Card>
    );
}
