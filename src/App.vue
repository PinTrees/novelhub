<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <site-title :title="site.title"></site-title>
      <v-spacer />
      <site-sign></site-sign>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer" width="400">
      <site-menu :items="site.menu"></site-menu>
    </v-navigation-drawer>

    <v-content>
      <router-view />
    </v-content>

    <t-footer :footer="site.footer"></t-footer>
  </v-app>
</template>

<script>
import SiteTitle from "@/components/title.vue";
import TFooter from "@/components/footer.vue";
import SiteMenu from "@/components/menu.vue";
import SiteSign from "@/components/sign.vue";

export default {
  components: { SiteTitle, TFooter, SiteMenu, SiteSign },
  name: "App",
  data() {
    return {
      drawer: false,
      site: {
        menu: [
          {
            title: "home",
            icon: "mdi-home",
            active: true,
            subItems: [
              {
                title: "Dashboard",
                to: "/",
              },
              {
                title: "About",
                to: "/about",
              },
            ],
          },
          {
            title: "about",
            icon: "mdi-account",
            subItems: [
              {
                title: "xxx",
                to: "/xxx",
              },
            ],
          },
        ],
        title: "Novel Hub",
        footer: "footer",
      },
    };
  },
  created() {
    this.subscribe();
  },
  mounted() {
    console.log(this.$firebase);
  },
  methods: {
    subscribe() {
      this.$firebase
        .database()
        .ref()
        .child("site")
        .on(
          "value",
          (sn) => {
            const v = sn.val();
            if (!v) {
              this.$firebase.database().ref().child("site").set(this.site);
              return;
            }
            this.site = v;
          },
          (e) => {
            console.log(e.message);
          }
        );
    },
    read() {
      this.$firebase
        .database()
        .ref()
        .child("abcd")
        .on("value", (sn) => {
          console.log(sn);
          console.log(sn.val());
        });
    },
    async readOnce() {
      const sn = await this.$firebase
        .database()
        .ref()
        .child("abcd")
        .once("value");
      console.log(sn.val());
    },
  },
};
</script>
