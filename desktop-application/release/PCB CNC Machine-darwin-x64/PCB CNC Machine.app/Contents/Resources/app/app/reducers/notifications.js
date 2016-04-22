const initialState = {
    logs: [{
      date: new Date(),
      from: "PCB CNC Machine:",
      message: "Welcome to PCB CNC Machine"
    }
  ]
}
export default function notifications(state = initialState, action) {
  switch (action.type) {
    case "LOG":
      if (action.from == undefined) action.from = "";
      state.logs.unshift({
        date: new Date(),
        from: action.from,
        message: action.message
      });
       return Object.assign({}, state, {
           logs: state.logs
       });
       break;
    default:
      return state;
  }
}
