import React, { Component } from "react";
import axios from "axios";

class Fib extends Component {
   state = {
      // empty array
      seenIndexes: [],
      // empty  object
      values: {},
      //empty string
      index: "",
   };

   componentDidMount() {
      this.fetchValues();
      this.fetchIndexes();

      setInterval(() => {
         this.fetchValues();
         this.fetchIndexes();
      }, 2000);
   }

   async fetchValues() {
      const values = await axios.get("/api/values/current");
      this.setState({ values: values.data });
   }

   // the indexes that have been ever submitted to the application.
   async fetchIndexes() {
      const seenIndexes = await axios.get("/api/values/all");
      this.setState({ seenIndexes: seenIndexes.data });
   }

   // we want this function to be a  bound one.
   handleSubmit = async (event) => {
      event.preventDefault();

      // we submit the index to the backend
      await axios.post("/api/values", {
         index: this.state.index,
      });
      // after submitting the index to the backend
      this.setState({ index: "" });
   };

   renderSeenIndexes() {
      return this.state.seenIndexes.map(({ number }) => number).join(", ");
   }

   rendervalues() {
      const entries = [];

      // key represents the index of the Fibonnacci number.
      for (let key in this.state.values)
         entries.push(
            <div key={key}>
               For index {key},I calculated {this.state.values[key]}
            </div>
         );

      return entries;
   }

   render() {
      return (
         <div>
            <form onSubmit={this.handleSubmit}>
               <label>Enter your index:</label>
               <input
                  value={this.state.index}
                  onChange={(event) =>
                     this.setState({ index: event.target.value })
                  }
               ></input>
               <button>Submit</button>
            </form>
            <h3>Indexes I have seen:</h3>
            {this.renderSeenIndexes()}

            <h3>Calculated Values:</h3>
            {this.rendervalues()}
         </div>
      );
   }
}

export default Fib;
