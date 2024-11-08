<template>
  <div class="collection-item">
    <div class="d-flex justify-content-center align-items-center flex-column">
      <div class="row">
          <div class="col-12">
              <div class="collection-description d-flex justify-content-center align-items-center flex-column">
                <!-- Affichage du titre de la collection, avec option d'édition -->
                <h2 v-if="!isEditing" class="collection-title fs-6 fs-md-5">{{ editedName }}</h2>
                <input
                  v-if="isEditing"
                  v-model="editedName"
                  type="text"
                  class="form-control"
                  placeholder="Edit Name"
                />
        
                <!-- Image de la collection -->
                <div class="collection-image-container w-100">
                  <img v-if="image" :src="image" :alt="editedName" class="collection-image w-100" />
                </div>
              </div>
        
              <!-- Boutons pour gérer la collection -->
              <div class="mt-3 d-flex justify-content-center">
                <button v-if="!isEditing" @click="startEditing" class="btn btn-success btn-sm me-2">
                  <i class="bi bi-pencil-square">Edit</i>
                </button>
                <button v-if="isEditing" @click="saveCollectionName" class="btn btn-primary btn-sm me-2">
                  Save
                </button>
                <button v-if="isEditing" @click="cancelEditing" class="btn btn-secondary btn-sm me-2">
                  Cancel
                </button>
                <button @click="deleteCollection" class="btn btn-danger btn-sm"><i class="bi bi-trash-fill">Delete</i></button>
              </div>
            </div>
              <!-- Bouton pour ouvrir la collection -->
            <button class="btn btn-dark mt-3 flex-grow-1" @click="openCollectionPage">
                Voir la Collection
            </button>
          
        </div>
      </div>
  </div>
</template>

  
<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { listeFavoritePoco } from '@/pocos/ListeFavoritePoco';
import { deleteFavoriteListAPI, updateFavoriteListAPI } from '@/api/user/UserService';
  
export default defineComponent({
  name: "Collection_Card",
  props: {
    collection: {
      type: Object as PropType<listeFavoritePoco>,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    mode: {
      type: String as PropType<'real' | 'test'>,
      default: 'test'
    }
  },
  data() {
    return {
      isEditing: false,
      editedName: this.collection.name,
      errorMessage: ""
    };
  },
  methods: {
    openCollectionPage() {
      this.$router.push(`/favorites/${this.collection.id}`);
    },
    startEditing() {
      this.isEditing = true;
      this.editedName = this.collection.name;
    },
    async saveCollectionName() {
      this.errorMessage = "";
      if (!this.editedName?.trim()) {
        this.errorMessage = "Le nom de la liste ne peut pas être vide.";
        return;
      }
      try {
        if (this.mode === 'real') {
          await updateFavoriteListAPI(this.collection.id, this.editedName);
          this.$emit("updateCollectionName", { id: this.collection.id, name: this.editedName });
        }
        this.$emit("updateCollectionName", { id: this.collection.id, name: this.editedName });
        this.isEditing = false;
      } catch (error) {
        this.errorMessage = "Erreur lors de la mise à jour de la liste.";
      }
    },
    cancelEditing() {
      this.isEditing = false;
      this.editedName = this.collection.name;
      this.errorMessage = "";
    },
    async deleteCollection() {
      this.errorMessage = "";
      try {
        if (this.mode === 'real') {
          await deleteFavoriteListAPI(this.collection.id);
          this.$emit("collectionDeleted", this.collection.id);
        }
        this.$emit("collectionDeleted", this.collection.id);
      } catch (error) {
        this.errorMessage = "Erreur lors de la suppression de la liste.";
      }
    }
  }
});
</script>
<style scoped>
.collection-item {
    margin-bottom: 30px;
    padding: 15px;
    background-color: white;
    border-radius: 15px;
    border: 2px solid #E2850B;
    box-shadow: 5px 5px 7px rgba(0, 0, 0, 0.3);
    height: auto;
    width: auto;
    min-width: 300px;
    max-width: 300px
}

.collection-description {
    text-align: center;
}

.collection-title {
    width: 100%;
    max-width: 100%;
    margin-bottom: 10px;
}

.collection-image-container {
    height: 200px;
    overflow: hidden;
}

.collection-image {
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
}

  </style>