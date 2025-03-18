package main

import (
	"net/http"
)

func main() {
	// Servir les fichiers statiques (CSS, JS, images)
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Routes pour les pages HTML
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./templates/home.html")
	})
	http.HandleFunc("/vpn", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./templates/vpn.html")
	})
	http.HandleFunc("/password_manager", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./templates/password-manager.html")
	})
	http.HandleFunc("/about", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./templates/about.html")
	})

	// Lancer le serveur sur le port 8080
	println("Server running at http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}
