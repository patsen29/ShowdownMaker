Vue.component('batter-charter', {
  data: function() {
    return {
      per400: {pa: 400, out: 232.0, so: 83.6, bb:74.8, si:42.8, db:18.4, tr:1.4, hr:30.6},
      pitAdv: {},
      batAdv: {},
      chartQuota: {},
      chart: {pa:20, so:1, gb:1, out:4, bb:5, si:7, db:2, tr:0, hr:2},
      ob: 10
    }
  },
  template: `<div>
    <p>
      <strong>OB:</strong>
      <input class="sm" type="number" min="4" max="14" v-model="ob">
      <button @click="recalc">Recalc</button>
    </p>
    <table>
      <tr>
        <th>&nbsp;</th>
        <th>PA</th>
        <th>Out</th>
        <th>SO</th>
        <th>BB</th>
        <th>1B</th>
        <th>2B</th>
        <th>3B</th>
        <th>HR</th>
        <th>wOBA</th>
      </tr>
      <tr>
        <td>per 400</td>
        <td>{{per400.pa}}</td>
        <td>{{per400.out}}</td>
        <td>{{per400.so}}</td>
        <td>{{per400.bb}}</td>
        <td>{{per400.si}}</td>
        <td>{{per400.db}}</td>
        <td>{{per400.tr}}</td>
        <td>{{per400.hr}}</td>
        <td>{{towOBA(per400).toFixed(3)}}</td>
      </tr>
      <tr v-if="pitAdv.pa">
        <td>Pitcher adv</td>
        <td>{{pitAdv.pa.toFixed(1)}}</td>
        <td>{{pitAdv.out.toFixed(1)}}</td>
        <td>{{pitAdv.so.toFixed(1)}}</td>
        <td>{{pitAdv.bb.toFixed(1)}}</td>
        <td>{{pitAdv.si.toFixed(1)}}</td>
        <td>{{pitAdv.db.toFixed(1)}}</td>
        <td>{{pitAdv.tr.toFixed(1)}}</td>
        <td>{{pitAdv.hr.toFixed(1)}}</td>
        <td>{{towOBA(pitAdv).toFixed(3)}}</td>
      </tr>
      <tr v-if="batAdv.pa">
        <td>Batter adv</td>
        <td>{{batAdv.pa.toFixed(1)}}</td>
        <td>{{batAdv.out.toFixed(1)}}</td>
        <td>{{batAdv.so.toFixed(1)}}</td>
        <td>{{batAdv.bb.toFixed(1)}}</td>
        <td>{{batAdv.si.toFixed(1)}}</td>
        <td>{{batAdv.db.toFixed(1)}}</td>
        <td>{{batAdv.tr.toFixed(1)}}</td>
        <td>{{batAdv.hr.toFixed(1)}}</td>
        <td>{{towOBA(batAdv).toFixed(3)}}</td>
      </tr>
      <tr v-if="chartQuota.pa">
        <td>Chart quota</td>
        <td>{{chartQuota.pa.toFixed(2)}}</td>
        <td>{{chartQuota.out.toFixed(2)}}</td>
        <td>{{chartQuota.so.toFixed(2)}}</td>
        <td>{{chartQuota.bb.toFixed(2)}}</td>
        <td>{{chartQuota.si.toFixed(2)}}</td>
        <td>{{chartQuota.db.toFixed(2)}}</td>
        <td>{{chartQuota.tr.toFixed(2)}}</td>
        <td>{{chartQuota.hr.toFixed(2)}}</td>
        <td>{{towOBA(batAdv).toFixed(3)}}</td>
      </tr>
      <tr>
        <td>Chart</td>
        <td>20</td>
        <td>{{chart.out}}</td>
        <td><input class="sm" type="number" v-model="chart.so" min="0" max="20"></td>
        <td><input class="sm" type="number" v-model="chart.bb" min="0" max="20"></td>
        <td><input class="sm" type="number" v-model="chart.si" min="0" max="20"></td>
        <td><input class="sm" type="number" v-model="chart.db" min="0" max="20"></td>
        <td><input class="sm" type="number" v-model="chart.tr" min="0" max="20"></td>
        <td><input class="sm" type="number" v-model="chart.hr" min="0" max="20"></td>
        <td>{{towOBA(chart).toFixed(3)}}</td>
      </tr>
    </table>

  </div>`,
  methods: {
    recalc: function() {
      const bAdv = this.ob - 3.4;
      const pAdv = 20 - bAdv;
      // Calculate pitching quota given advantage
      const pitAdv = {
        pa: pAdv*20, so: pAdv*4.32, bb: pAdv*1.14, si: pAdv*2.01, db: pAdv*0.74, tr: 0, hr: pAdv*0.09
      }
      pitAdv.out = pitAdv.pa - pitAdv.bb - pitAdv.si - pitAdv.db - pitAdv.hr;
      // Calculate batting quota from advantage
      const batAdv = {
        pa: bAdv*20,
        out: this.per400.out - pitAdv.out,
        so: this.per400.so - pitAdv.so,
        bb: this.per400.bb - pitAdv.bb,
        si: this.per400.si - pitAdv.si,
        db: this.per400.db - pitAdv.db,
        tr: this.per400.tr - pitAdv.tr,
        hr: this.per400.hr - pitAdv.hr,
      }
      // Calculate batting chart quota
      const chartQuota = {
        pa: 20,
        out: batAdv.out / bAdv,
        so: batAdv.so / bAdv,
        bb: batAdv.bb / bAdv,
        si: batAdv.si / bAdv,
        db: batAdv.db / bAdv,
        tr: batAdv.tr / bAdv,
        hr: batAdv.hr / bAdv
      }

      // Save results to display
      this.pitAdv = pitAdv;
      this.batAdv = batAdv;
      this.chartQuota = chartQuota;

    },
    towOBA: function(stats) {
      if (stats.h) {
        return (0.7*stats.bb + 0.9*stats.h + .35*stats.db + .7*stats.tr + 1.1*stats.hr)/stats.pa
      }
      return (0.7*stats.bb + 0.9*stats.si + 1.25*stats.db + 1.6*stats.tr + 2.0*stats.hr)/stats.pa
    }
  },
  computed: {

  }
})

let app = new Vue({
  el: "#app",
  data: {
    myData: "Oi!"
  }
});

