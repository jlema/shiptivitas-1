import React from 'react';
import ReactDOM from 'react-dom';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients.filter(client => !client.status || client.status === 'backlog'),
        inProgress: clients.filter(client => client.status && client.status === 'in-progress'),
        complete: clients.filter(client => client.status && client.status === 'complete'),
      },
      laneFrom: -1,
      laneTo: -1,
      rowFrom: -1,
      rowTo: -1
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
  }
  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'in-progress'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'in-progress'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'in-progress'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'complete'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'complete'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'in-progress'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'in-progress'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'complete'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }
  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane name={name} clients={clients} dragulaRef={ref}/>
    );
  }

  getDOMIndex = (el) => {
    return Array.from(el.parentNode.children).indexOf(el);
  };

  componentDidMount = () => {
    this.drake = Dragula([
      ReactDOM.findDOMNode(this.swimlanes.backlog.current),
      ReactDOM.findDOMNode(this.swimlanes.inProgress.current),
      ReactDOM.findDOMNode(this.swimlanes.complete.current)
    ]);

    this.drake.on("drag", (el, source) => {
      // el was lifted from source
      this.setState({rowFrom: this.getDOMIndex(el)});
    });
    
    this.drake.on('drop', (el, target, source, sibling) => {
      // el was dropped into target before a sibling element, and originally came from source
      this.setState({laneFrom: this.getDOMIndex(source.parentNode.parentNode)});
      this.setState({laneTo: this.getDOMIndex(target.parentNode.parentNode)});
      this.setState({rowTo : this.getDOMIndex(el)});

      const clientsFromKey = Object.keys(this.state.clients)[this.state.laneFrom];
      let clientsFromCopy = [...this.state.clients[clientsFromKey]];

      let item = clientsFromCopy.splice(this.state.rowFrom, 1)[0];
      const clientsToKey = Object.keys(this.state.clients)[this.state.laneTo];
      
      if (clientsFromKey === clientsToKey) {
        clientsFromCopy.splice(this.state.rowTo, 0, item);
        this.setState({ clients: { ...this.state.clients, [clientsFromKey]: clientsFromCopy } });
      } else {
        clientsToKey === 'inProgress' ? item.status = 'in-progress' : item.status = clientsToKey;
        let clientsToCopy = [...this.state.clients[clientsToKey]];
        clientsToCopy.splice(this.state.rowTo, 0, item);

        this.setState(prevState => {
              return (
                { clients: { ...prevState.clients, [clientsFromKey]: prevState.clients[clientsFromKey].filter(client => client.id !== item.id) } }
              );
            } 
          ); //this line blows
        this.setState({ clients: { ...this.state.clients, [clientsToKey]: clientsToCopy } });
      }
      
    });

  };

  componentWillUnmount = () => {
    this.drake.destroy();
  };

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
