import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import '../App.css';

class Promotionlist extends React.Component {
    state = {
      open: false,
    };
  
    handleClickOpen = () => {
      this.setState({ open: true });
    };
  
    handleClose = () => {
      this.setState({ open: false });
    };
  
    render() {
        // const { classes } = this.props;
      return (
        <div style={{overflow:'hidden'}}>
          <Button style={{color:'#ff8400'}} onClick={this.handleClickOpen}>Regression QA-20%</Button>
          <Button style={{color:'#ff8400', float:'right'}}>APPLY</Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Regression QA-20%"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Regression QA-20% Displayed Message
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {/* <Button onClick={this.handleClose} color="primary">
                Disagree
              </Button> */}
              <Button onClick={this.handleClose} color="primary" autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
  }
  
  export default Promotionlist;