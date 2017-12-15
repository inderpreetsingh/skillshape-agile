export function formStyles() {
   return {
        formControlInline:{
          display: 'flex',
          flexWrap: "wrap",
          width: "100%",
          justifyContent: "space-between"
        },
        formControl: {
          display: 'flex',
          flexWrap: "wrap",
          paddingRight: 10
        },
        formControlLabel: {
          display: 'flex',
          marginRight: 10
        },
        formControlInput: {
          display: 'flex',
          width: "100%",
          minWidth: 211
        },
        row: {
          display: 'flex',
          flexWrap: "wrap",
          paddingRight: 10
        },
        col: {
          display: 'flex',
          flexDirection: 'column',
          paddingRight: 15,
          paddingLeft: 15
        },
        center: {
            alignItems: 'center',
        }
    };
};