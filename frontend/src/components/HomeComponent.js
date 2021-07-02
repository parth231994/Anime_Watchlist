import React ,{ Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { rendered: ''};
    }

    componentDidMount(){
        this.state.rendered = this.getAllSeries();
    }

    getAllSeries = async () =>{
        const apiUrl = 'http://localhost:3000/series';
        const authToken = localStorage.getItem('JwtToken');

        let renderedItems = ''

        fetch(apiUrl,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
              }
          })
          .then((response) => response.json())
          .then((data) =>{
              console.log("data", data)
            
          });

          return renderedItems
    }

    renderItem = (item) =>{
        console.log('rendering an item...')
        const defaultPreview = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.stack.imgur.com%2FQ3vyk.png&f=1&nofb=1'
        let element = `
        <div className="row">
         <div className="col-md bg-success"> 
          <Card>
           `
        if(item.preview !== undefined){
            element = element.concat('<CardImg top width="100%" src="' + item.preview + '" alt="Preview Image" />')
        } else{
            element = element.concat('<CardImg top width="100%" src="' + defaultPreview + '" alt="Preview Image" />')
        }
        element = element.concat('<CardBody>')


        element = element.concat('<CardTitle>Title: '+ item.title + '</CardTitle>')
        element = element.concat('<CardSubtitle> Episode: ' + item.episodeNr + ' of ' + item.episodeTotal + '</CardSubtitle>')

        element = element.concat('<CardText>')
        if(item.type !== undefined){ 
           element = element.concat('Type: '+item.type + '<br />') 
        }
        if(item.startedAiring !== undefined){ 
           element = element.concat('Started Airing: '+item.startedAiring + '<br />') 
        }
        element = element.concat('<a href="' + item.episodeLink.replace('{#}', item.episodeNr) + '"> Watch Episode </a>')
        element = element.concat('</CardText>')

        element = element.concat(`
           </CardBody>
          </Card>
         </div>
        </div>`)
        console.log('to be rendered: ' + element)
        // TODO: Button to increase/decrese EpNr
        return element
    }

    render(){
        this.getAllSeries()
        .then((watchlist)=>{
            console.log('watchlist: ' + watchlist)
        return (
            <div className="container">
                <h1>Home Component</h1>

                <div className="container-fluid">
                    {this.renderedItems}
                </div>
        </div>
        );
        }).catch((err)=> {console.log('Error:' + err)})
        
        return (<div><h1>Could not render!</h1></div>)
        
    }
}

export default Home;