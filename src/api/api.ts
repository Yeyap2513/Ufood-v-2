const secure_type = "/unsecure";

const endpoint = "https://ufoodapi.herokuapp.com";

// USER

export const signupUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const route = `${endpoint}/signup`;

  const body = new URLSearchParams({
    name: name,
    email: email,
    password: password,
  });

  const response = await fetch(route, {
    method: "POST",
    headers: {
      "Content-Type": "x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  const data = await response.json();
  return data;
};

export const listUsers = async () => {
  const route = `${endpoint}${secure_type}/users`;

  const response = await fetch(route, {
    method: "GET",
  });

  const data = await response.json();
  return data.items;
};

export const getUser = async (userId: string) => {
  const route = `${endpoint}${secure_type}/users/${userId}`;

  const response = await fetch(route, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};

export const getUserFavorites = async (userId: string) => {
  const route = `${endpoint}${secure_type}/users/${userId}/favorites`;

  const response = await fetch(route, {
    method: "GET",
  });

  const data = await response.json();
  console.log(data.items)

  return data.items;
};

// // RESTAURANT

//Retrieve restaurants
export const getRestaurants = async () => {
  const route = `${endpoint}${secure_type}/restaurants`;

  try {
    const response = await fetch(route);
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.log("Error getting restaurants .....");
  }
};

//Retrieve a specific restaurant
export const getRestaurant = async (restaurantId: string) => {
  const route = `${endpoint}${secure_type}/restaurants/${restaurantId}`;

  const response = await fetch(route, {
    method: "GET",
  });

  const data = await response.json();
  console.log("liste", data);
  return data;
};

//Retrieve differents visits in a specific restaurant
export const getRestaurantVisits = async (restaurantId: string) => {
  const route = `${endpoint}${secure_type}/restaurants/${restaurantId}/visits`;

  const response = await fetch(route, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};

// // VISITE DE RESTAURANTS

//Restaurant list visted by user
export const getRestaurantsVisitedByUser = async (userId: string) => {
  const route = `${endpoint}${secure_type}/users/${userId}/restaurants/visits`;

  const response = await fetch(route, {
    method: "GET",
  });

  const data = await response.json();
  return data.items;
};

//One particular restaurant visit
export const getVisit = async (userId: string, visitId: string) => {
  const route = `${endpoint}${secure_type}/users/${userId}/restaurants/visits/${visitId}`;

  const response = await fetch(route, {
    method: "GET",
  });

  const data = await response.json();
  return data;
};

//Post a new restaurant visit
export const postVisitRestaurant = async (
  userId: string,
  restaurant_id: string,
  comment: string,
  rating: Int16Array,
  date: Date,
) => {
  const route = `${endpoint}${secure_type}/users/${userId}/restaurants/visits`;

  const body = {
    restaurant_id: restaurant_id,
    comment: comment,
    rating: rating,
    date: date.toISOString(),
  };

  const response = await fetch(route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return data;
};

//All Visits in a particular restaurant
export const getRestaurantUserVisits = async (
  userId: string,
  restaurantId: string,
) => {
  const route = `${endpoint}${secure_type}/users/${userId}/restaurants/${restaurantId}/visits`;

  const response = await fetch(route, {
    method: "GET",
  });

  const data = await response.json();
  return data.items;
}

// Créer une nouvelle liste de favoris pour un utilisateur
export const createFavoriteListAPI = async (ownerEmail: string, listName: string) => {
  const route = `${endpoint}${secure_type}/favorites`; // Utilise le chemin /unsecure

  const body = {
    name: listName,
    owner: ownerEmail,
  };

  const response = await fetch(route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création de la liste de favoris");
  }

  const data = await response.json();
  return data;
};

// Récupérer toutes les listes de favoris
export const getFavoriteLists = async () => {
  const route = `${endpoint}${secure_type}/favorites`; // Utilise le chemin /unsecure

  const response = await fetch(route, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des listes de favoris");
  }

  const data = await response.json();
  return data.items; // Assurez-vous que la structure des données correspond
};

 
// Suppression d'une liste de favoris
export const deleteFavoriteListAPI = async (listId: string) => {
  const route = `${endpoint}${secure_type}/favorites/${listId}`;

  const response = await fetch(route, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de la liste de favoris");
  }

  const data = await response.json();
  return data;
};

// Mise à jour du nom d'une liste de favoris
export const updateFavoriteListAPI = async (listId: string, newName: string) => {
  const route = `${endpoint}${secure_type}/favorites/${listId}`;

  const body = {
    name: newName
  };

  const response = await fetch(route, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la mise à jour de la liste de favoris");
  }

  const data = await response.json();
  return data;
};


// Gestion des Collections de favoris

//Get restoCollection items
export const getFavoriteById = async (collectionId: string) => {
  const params = {
    method: "GET",
  }
  const url = `${endpoint}${secure_type}/favorites/${collectionId}`;
  const response = await fetch(url, params);

  if (!response.ok) {
    throw new Error("");
  }

  const data = response.json();
  return data;
}


// Creer une collection
export const createCollection = async (owner: string, name:string) =>{
  const body = {
    name: name,
    owner: owner
  }
  const url =  `${endpoint}${secure_type}/favorites`;

  const params = {
      method: "POST",
      headers: {
          "content-type": "application/json",
      },
      body: JSON.stringify(body),
  }

  const response = await fetch(url, params);

  if (!response.ok) {
      throw new Error("");
  }

  const data = await response.json();
  return data;
}

//Ajouter un restaurant dans une liste
export const addRestoCollection = async (restoId: string, collection: string) =>{
  const body = {
    id: restoId,
  }
  const url =  `${endpoint}${secure_type}/favorites/${collection}/restaurants`;

  const params = {
    method: "POST",
    headers: {
        "content-type": "application/json",
    },
    body: JSON.stringify(body),
  }

  const response = await fetch(url, params);

  if (!response.ok) {
      throw new Error("");
  }

  const data = await response.json();
  return data;
}

//Supprimer un restaurant d'une liste
export const deleteRestoFromCollection = async (collectionId: string, restaurantId: string) => {
  const route = `${endpoint}${secure_type}/favorites/${collectionId}/restaurants/${restaurantId}`;

  const response = await fetch(route, {
    method: "DELETE",
  });

  const data = await response.json();
  return data.items;
}