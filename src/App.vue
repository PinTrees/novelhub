<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <site-title :title="title"></site-title>
      <v-spacer />
      <v-btn icon @click="save">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"> Application </v-list-item-title>
          <v-list-item-subtitle> subtext </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>
      <v-list>
        <v-list-group
          v-for="(item, i) in items"
          :key="i"
          v-model="item.active"
          :prepend-icon="item.icon"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="subItem in item.subItems"
            :key="subItem.title"
            :to="subItem.to"
          >
            <v-list-item-content>
              <v-list-item-title v-text="subItem.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <router-view />
    </v-content>

    <t-footer :footer="footer"></t-footer>
  </v-app>
</template>

<script>
import SiteTitle from '@/views/site/title.vue';
import TFooter from '@/components/footer.vue';
//import SiteMenu from '@/components/menu.vue'

export default {
  components: { SiteTitle, TFooter /*SiteMenu*/ },
  name: 'App',
  data() {
    return {
      drawer: false,
      item: [],
      title: 'ssssss',
      footer: 'footer',
      items: [
        {
          title: 'home',
          icon: 'mdi-home',
          active: true,
          subItems: [
            {
              title: 'Dashboard',
              to: '/',
            },
            {
              title: 'About',
              to: '/about',
            },
          ],
        },
        {
          title: 'about',
          icon: 'mdi-account',
          subItems: [
            {
              title: 'xxx',
              to: '/xxx',
            },
          ],
        },
      ],
    };
  },
  mounted() {
    console.log(this.$firebase);
  },
  methods: {
    save() {
      console.log('save sss');
    },
  },
};
</script>
