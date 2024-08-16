<script setup>
import { ref, onMounted, computed, watch } from 'vue';

import draggable from 'vuedraggable'

const fetchedData = ref([]);
const translatedLang = ref({});
const selectedLangs = ref([]);
const searchQuery = ref("");
const favLang = ref();

async function TranslateLang(data) {
  favLang.value = selectedLangs.value[0]
  const url = ref();


  if (data != undefined) {
    url.value = "https://funwithapis-4kbqnvs2ha-uc.a.run.app/v1/translations/" + data;


  } else if(favLang.value != undefined) {
    url.value = "https://funwithapis-4kbqnvs2ha-uc.a.run.app/v1/translations/" + favLang.value.id;


  } else {
    url.value = "https://funwithapis-4kbqnvs2ha-uc.a.run.app/v1/translations/en";

  }



  try {
    const response = await fetch(url.value);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    translatedLang.value = data;

  } catch (error) {
    console.error(error.message);
  }
}

const filteredLang = computed(() => {
      const query = searchQuery.value.toLowerCase();
      return fetchedData.value.filter((lang) => {
        return Object.entries(lang.value.languageIsoCodesWithLocales).some(([key, value]) => {
          return value.toLowerCase().includes(query);
        });
      });
    });

async function getLang() {
  const url = "https://funwithapis-4kbqnvs2ha-uc.a.run.app/v1/allLanguages/en-US";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }


    const data = await response.json();
  
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        fetchedData.value.push({id: key, value: data[key]});
      }
    }

    //console.log(fetchedData.value);
  } catch (error) {
    console.error(error.message);
  }
}

onMounted(() => {
const storagedLangs = JSON.parse(localStorage.getItem('name'));
selectedLangs.value = storagedLangs;
TranslateLang();
getLang();

})

// Watch for changes in selectedLangs and trigger TranslateLang
watch(selectedLangs, (newVal, oldVal) => {
  TranslateLang();
  localStorage.setItem('name', JSON.stringify(selectedLangs.value))
}, { deep: true });

const add = (id, lang) => {
  //console.log(id, lang)
  selectedLangs.value.unshift({
    'name': lang,
    'id': id
  })

  //console.log(selectedLangs.value)
  TranslateLang();
}

const remove = (id) => {
  let i = selectedLangs.value.map(item => item.id).indexOf(id) // find index of your object
  selectedLangs.value.splice(i, 1) // remove it from array
  TranslateLang();
}


  window.addEventListener("storage", (event) => {
      selectedLangs.value = JSON.parse(event.newValue);
      TranslateLang();
  });

</script>

<template>
  <div class="content">
    <h1  @click="TranslateLang()">{{ translatedLang.SortLanguagesPrompt}}</h1>
      <div class="lang-content">
        <div>
        <h2>list of all the langues</h2>
 
          <input placeholder="CTRL + F  to search" v-model="searchQuery" />        
        <div class="dropdown">

          <div v-for="item in filteredLang" >
            <p v-for="(value, key) in item.value.languageIsoCodesWithLocales" @click="add(key, value)">
              {{ key + ' - ' + value }}
            </p>
            
          </div>
        </div>  
      </div>
      <!--
        <div class="lang" @drop="drop" @dragover="allowDrop" > 
          <h2>Selected languages</h2>
          <div class="selectLang" v-for="lang in selectedLangs" :key="lang.id" :id="lang.id" draggable="true" @dragstart="drag">
            <p @click="TranslateLang(lang.id)" :id="'p' + lang.id">
              {{ lang.name }}
            </p>
            <p class="add" @click="remove(lang.id)"> X </p>
          </div>
        </div>  
        -->   
        <draggable
          v-model="selectedLangs"
          item-key="id">
          <template #item="{element: langue}" >
            <div class="selectLang">
            <p> {{  langue.name }} {{ langue.id }}</p>
            <span class="add" @click="remove(langue.id)"> X </span>
          </div>
          </template>
          </draggable>
    </div>
  </div>
</template>

<style>

body {
  color: rgb(247, 247, 247);
  background-color: rgba(0, 0, 0, 0.774);

  font-family: "Kode Mono", monospace;

  font-style: normal;


}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  

  h1 {
    max-width: 50vw;
    border-bottom: 1px solid rgb(247, 247, 247);
    margin-bottom: 50px;
  }
}

.lang-content {
  width: 50vw;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  input  {
    width: 100%;
    background-color: rgba(0, 0, 0, 0);
    border: none;
    border-bottom: 1px solid rgb(247, 247, 247);
    color: rgb(247, 247, 247);
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    text-transform: capitalize;
  }

  .dropdown {
    max-height: 400px;
    max-width: 800px;
    
    
    overflow-y: scroll;

    p {
      border-bottom: 1px solid rgba(247, 247, 247, .3);
      width: 90%;
    }
  }

  .lang {
    width: 30%;
  }

  .selectLang {
    display: flex; 
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(247, 247, 247, .3);
    padding: 0 10px;
    margin: 20px 0px;

    p {
      min-width: 300px;
    }

    .add {
      cursor: pointer;
      
    }

  }

}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}


</style>
