import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Slider from '@material-ui/lab/Slider';
import Grid from '@material-ui/core/Grid';
// core components
import customInputStyle from "assets/jss/material-dashboard-react/components/customInputStyle.jsx";

function CustomInput({ ...props }) {
  const {
    classes,
    labelText,
    id,
    labelProps,
    sliderProps,
    inputProps,
  } = props;

  const marginTop = classNames({
    [classes.marginTop]: labelText === undefined
  });
  return (
    <Grid container spacing={8} alignItems="center">
         {labelText !== undefined ? (
           <InputLabel
             className={classes.labelRoot }
             htmlFor={id}
             {...labelProps}
             style={{padding:'8px'}}
           >
             {labelText}
           </InputLabel>
         ) : null}
      <Grid item xs>
      <Slider
            {...sliderProps}
            style={{padding:'8px'}}
          />
          </Grid>
          <Grid item  style={{width:'50px'}}>
      <Input
        classes={{
          root: marginTop,
          disabled: classes.disabled
        }}
        id={id}
        {...inputProps}
        
      />
      </Grid>
      </Grid>
  );
}

CustomInput.propTypes = {
  classes: PropTypes.object.isRequired,
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  sliderProps: PropTypes.object,
  inputProps: PropTypes.object,
};

export default withStyles(customInputStyle)(CustomInput);
