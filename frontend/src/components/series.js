import React, { useState } from 'react'
import '../App.css'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from "@material-ui/core/Grid"
import 'date-fns'
import DateFnsUtils from "@date-io/date-fns"
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from "@material-ui/pickers"
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

function Series(props){

    const token = props.token
    const baseUrl = props.baseUrl
    const series = props.series
    const id = series._id
    const removeSeries = props.removeSeries
    const [epNr, setEpNr] = useState(series.episodeNr)
    const [open, setOpen] = useState(false)

    const [title, setTitle] = useState(series.title)
    const [episodeLink, setEpisodeLink] = useState(series.episodeLink)
    const [type, setType] = useState(series.type)
    const [previewLink, setPreviewLink] = useState(series.preview)
    const [episodeNr, setEpisodeNr] = useState(series.episodeNr)
    const [episodeTotal, setEpisodeTotal] = useState(series.episodeTotal)
    const [dateAired, setDateAired] = useState(series.startedAiring)
    
    let done = false
    if(series.completed !== undefined){done = series.completed} 
    else if(localStorage.getItem('done-'+id) !== undefined){done = localStorage.getItem('done-'+id)}
    const [completed, setCompleted] = useState(done)
    
    const incEpisode = async (id) => {
        let newNr = series.episodeNr + 1
        console.log(newNr)
        if(newNr <= series.episodeTotal){
            try{
                const response = await fetch(baseUrl+'/series/'+id,{
                    method: 'PUT',
                    mode:'cors',
                    cache: 'no-cache',
                    headers: {
                        'Content-Type':'application/json',
                        'Authorization':'Bearer ' + token
                    },
                    body: JSON.stringify({
                        episodeNr: newNr
                    })
                })
                if(response.status === 200){
                    series.episodeNr = newNr
                    setEpNr(newNr)
                    setEpisodeNr(newNr)
                }
            } catch(err){console.log(err)}
        } else {
            console.log('Cant Increment! max. Reached!')
        }
    }

    const markFinished = async (id) => {
        done = !done
        try{
            const response = await fetch(baseUrl+'/series/'+id, {
                method: 'PUT',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':'Bearer ' + token
                },
                body: JSON.stringify({
                    completed: done
                })
            })
            if(response.status===200){
                series.completed = done
                localStorage.setItem('done-'+id, done)
                setCompleted(done)
            }
        } catch(err){console.log(err)}
    }

    if(series.preview === undefined){ series.preview = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.stack.imgur.com%2FQ3vyk.png&f=1&nofb=1'; setPreviewLink(series.preview) }
    const decodedLink = series.episodeLink.replace('{#}', series.episodeNr)

    let formatedDate = ''
    if(typeof(series.startedAiring) === typeof('string')){
        let aired = new Date(series.startedAiring)
        let dayName = aired.toDateString().split(' ')[0]
        let [month, day, year]    = aired.toLocaleDateString().split("/")
        let [hour, minute, second] = aired.toTimeString().slice(0,7).split(":")
        formatedDate = '(' + dayName + ') ' + day + '.' + month + '.' + year + ', ' + hour + ':' + minute
    }

    const openDialog = () => { setOpen(true) }
    const closeDialog = () => {  
        setOpen(false) 
        resetState()
    }
    const resetState = async () => {
        try {
            const response = await fetch(baseUrl+'/series/'+id, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':'Bearer ' + token
                }
            })
            const respJson = await response.json()
            console.log('Cancel: ')
            console.log(respJson)
            setTitle(respJson[0].title)
            setEpisodeLink(respJson[0].episodeLink)
            setType(respJson[0].type)
            setPreviewLink(respJson[0].preview)
            setEpisodeNr(respJson[0].episodeNr)
            setEpisodeTotal(respJson[0].episodeTotal)
            setDateAired(respJson[0].startedAiring)
        } catch (err) {
            console.log(err)
        }
    }

    const updateSeries = async () => {
        let newPreview = previewLink
        if(previewLink===''){ newPreview = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.stack.imgur.com%2FQ3vyk.png&f=1&nofb=1' }
        try{
            const response = await fetch(baseUrl+'/series/'+id, {
                method: 'PUT',
                mode:'cors',
                cache:'no-cache',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    title: title,
                    episodeLink: episodeLink,
                    type: type,
                    preview: newPreview,
                    episodeNr: episodeNr,
                    episodeTotal: episodeTotal,
                    startedAiring: dateAired
                })
            })
            const respJson = await response.json()
                
            // clean up state
            setTitle(respJson.title)
            setEpisodeLink(respJson.episodeLink)
            setType(respJson.type)
            setPreviewLink(respJson.preview)
            setEpisodeNr(respJson.episodeNr)
            setEpisodeTotal(respJson.episodeTotal)
            setDateAired(respJson.startedAiring)
            
            console.log(respJson)
        } catch(err){console.log(err)}
    }

    // When on last Episode: check for completed flag, if present/true then display undo completed button otherwise mark as finished button
    if(episodeNr === episodeTotal){
        let ButtonText = 'Mark as Completed'
        if(done === true){ButtonText = 'Mark as Watching'}

        let EpisodeCount = 'Episode ' + episodeNr + ' of ' + episodeTotal
        if(done===true){EpisodeCount = 'Finished Watching.'}

        return(
            <div className="series">
                <img className="seriesPreview" src={previewLink} alt="Preview Image" />
                <div className="details">
                    <h3> {title} </h3>
                    <h5> {EpisodeCount} </h5>
                    <p>
                        Type: {series.type} <br/>
                        started Airing on: {formatedDate} <br/>
                        <a href={decodedLink}>
                        {<Button
                                variant="contained"
                                color="primary"
                                size="small"
                            >
                                Watch Episode
                        </Button>}
                        </a>

                        {<Button
                                variant="contained"
                                onClick={(e) => markFinished(id)}
                                size="small"
                            >   {ButtonText}
                            
                        </Button>}
                        
                        <Button onClick={openDialog}>Edit </Button>
                       
                    </p>

                </div>
                <Dialog open={open} onClose={closeDialog} aria-labeledby="editform-dialog-title">
                    <DialogTitle id="editform-dialog-title">Edit {title}</DialogTitle>
                    <DialogContent>
                    <TextField 
                            margin='normal'
                            required
                            fullWidth
                            id='title'
                            label='Title'
                            name='title'
                            autoComplete='title'
                            value={title}
                            onChange={(e)=>{setTitle(e.target.value)}}
                            autoFocus
                        />
                        <TextField 
                            margin='normal'
                            required
                            fullWidth
                            id='episodeLink'
                            label='Link to Episode'
                            name='episodeLink'
                            autoComplete='episodeLink'
                            value={episodeLink}
                            onChange={(e)=>setEpisodeLink(e.target.value)}
                        />
                        <TextField 
                            margin='normal'
                            fullWidth
                            id='previewLink'
                            label='Link to Preview Image'
                            name='previewLink'
                            autoComplete='previewLink'
                            value={previewLink}
                            onChange={(e)=>setPreviewLink(e.target.value)}
                        />
                        <FormControl>
                            <InputLabel id='type-label' >Content Type</InputLabel>
                            <Select 
                                labelId='type-label' 
                                id='type'
                                fullWidth
                                value={type}
                                onChange={(e)=> setType(e.target.value)}
                                >
                                <MenuItem value='TV-Series'>TV-Series</MenuItem>
                                <MenuItem value='Movie'>Movie</MenuItem>
                                <MenuItem value='Original Video Animation (OVA)'>Original Video Animation (OVA)</MenuItem>
                                <MenuItem value='Original Net Animation (ONA)'>Original Net Animation (ONA)</MenuItem>
                                <MenuItem value='Special'>Special</MenuItem>
                                <MenuItem value='Other'>Other</MenuItem>
                                <MenuItem value='Not Specified'>Not Specified</MenuItem>
                            </Select>
                        </FormControl>
                        <Grid container justify="space-around">
                        <TextField 
                            type='number'
                            id='episodeNr'
                            label='Current Episode'
                            name='episodeNr'
                            value={episodeNr}
                            onChange={(e)=> setEpisodeNr(e.target.value)}
                        />
                        <TextField 
                            type='number'
                            id='episodeTotal'
                            label='Total Episodes'
                            name='episodeTotal'
                            value={episodeTotal}
                            onChange={(e)=> setEpisodeTotal(e.target.value)}
                        />
                        </Grid>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                                <KeyboardDatePicker
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label="Date Series started Airing"
                                    format="dd/MM/yyyy"
                                    value={dateAired}
                                    onChange={(date)=> setDateAired(date)}
                                    KeyboardButtonProps={{
                                        "aria-label": "change date"
                                    }}
                                />
                                <KeyboardTimePicker
                                    margin="normal"
                                    id="time-picker"
                                    label="Date Series started Airing"
                                    value={dateAired}
                                    onChange={(date)=> setDateAired(date)}
                                    KeyboardButtonProps={{
                                        "aria-label": "change time"
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>{updateSeries(); closeDialog()}}>Confirm Edits</Button>
                        <Button onClick={closeDialog}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
    // Otherwise
    return(
        <div className="series">
            <img className="seriesPreview" src={previewLink} alt="Preview Image" />
            <div className="details">
                <h3> {title} </h3>
                <h5> Episode {episodeNr} of {episodeTotal} </h5>
                <p>
                    Type: {type} <br/>
                    started Airing on: {formatedDate} <br/>
                    <a href={decodedLink}>
                    {<Button 
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      Watch Episode
                    </Button>}
                    </a>

                    <Button
                      onClick={(e) => incEpisode(id)}
                      variant="contained"
                      color="secondary"
                      size="small"
                    >
                      Next Episode
                    </Button>
                                     
                    <Button onClick={openDialog}>Edit</Button> 
                </p>
            </div>
            <Dialog open={open} onClose={closeDialog} aria-labeledby="editform-dialog-title">
                    <DialogTitle id="editform-dialog-title">Edit {title}</DialogTitle>
                    <DialogContent>
                    <TextField 
                            margin='normal'
                            required
                            fullWidth
                            id='title'
                            label='Title'
                            name='title'
                            autoComplete='title'
                            value={title}
                            onChange={(e)=>{setTitle(e.target.value)}}
                            autoFocus
                        />
                        <TextField 
                            margin='normal'
                            required
                            fullWidth
                            id='episodeLink'
                            label='Link to Episode'
                            name='episodeLink'
                            autoComplete='episodeLink'
                            value={episodeLink}
                            onChange={(e)=>setEpisodeLink(e.target.value)}
                        />
                        <TextField 
                            margin='normal'
                            fullWidth
                            id='previewLink'
                            label='Link to Preview Image'
                            name='previewLink'
                            autoComplete='previewLink'
                            value={previewLink}
                            onChange={(e)=>setPreviewLink(e.target.value)}
                        />
                        <FormControl>
                            <InputLabel id='type-label' >Content Type</InputLabel>
                            <Select 
                                labelId='type-label' 
                                id='type'
                                fullWidth
                                value={type}
                                onChange={(e)=> setType(e.target.value)}
                                >
                                <MenuItem value='TV-Series'>TV-Series</MenuItem>
                                <MenuItem value='Movie'>Movie</MenuItem>
                                <MenuItem value='Original Video Animation (OVA)'>Original Video Animation (OVA)</MenuItem>
                                <MenuItem value='Original Net Animation (ONA)'>Original Net Animation (ONA)</MenuItem>
                                <MenuItem value='Special'>Special</MenuItem>
                                <MenuItem value='Other'>Other</MenuItem>
                                <MenuItem value='Not Specified'>Not Specified</MenuItem>
                            </Select>
                        </FormControl>
                        <Grid container justify="space-around">
                        <TextField 
                            type='number'
                            id='episodeNr'
                            label='Current Episode'
                            name='episodeNr'
                            value={episodeNr}
                            onChange={(e)=> setEpisodeNr(e.target.value)}
                        />
                        <TextField 
                            type='number'
                            id='episodeTotal'
                            label='Total Episodes'
                            name='episodeTotal'
                            value={episodeTotal}
                            onChange={(e)=> setEpisodeTotal(e.target.value)}
                        />
                        </Grid>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                                <KeyboardDatePicker
                                    margin="normal"
                                    id="date-picker-dialog"
                                    label="Date Series started Airing"
                                    format="dd/MM/yyyy"
                                    value={dateAired}
                                    onChange={(date)=> setDateAired(date)}
                                    KeyboardButtonProps={{
                                        "aria-label": "change date"
                                    }}
                                />
                                <KeyboardTimePicker
                                    margin="normal"
                                    id="time-picker"
                                    label="Date Series started Airing"
                                    value={dateAired}
                                    onChange={(date)=> setDateAired(date)}
                                    KeyboardButtonProps={{
                                        "aria-label": "change time"
                                    }}
                                />
                            </Grid>
                        </MuiPickersUtilsProvider>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>{updateSeries(); closeDialog()}}>Confirm Edits</Button>
                        <Button onClick={closeDialog}>Cancel</Button>
                    </DialogActions>
                </Dialog>
        </div>
    )
}

export default Series