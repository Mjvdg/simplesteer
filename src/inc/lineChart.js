import { Line} from "vue-chartjs";

export default {
  extends: Line,
  props: ["chartData", "graphTitle"],
  data() {
    return {
      options: {
        tooltips: {enabled: false},
        hover: {mode: null},
        responsive: true,
        maintainAspectRatio: false,
        title: {
          text: this.graphTitle,
          display: true
        },
        legend: {
          display: false
        },
        animation: false,
        scales: {
          xAxes: [{
            display: false,
            type: 'time',
          }],
          yAxes: [{
            position: 'right'
        }]
        },      
        
      }
    };
  },
  mounted () {
    this.render();
  },
  methods: {
    render(){
      this.renderChart(this.chartData, this.options);
    },    
  }
};


