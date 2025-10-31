
    // ======== DONNÉES DE DÉPART ========

    let taxis = [
      { id: 1, position: 5, available: true, timeRemaining: 0, totalRides: 0 },
      { id: 2, position: 12, available: true, timeRemaining: 0, totalRides: 0 },
      { id: 3, position: 20, available: true, timeRemaining: 0, totalRides: 0 }
    ];

    let requests = [
      { reqId: 1, position: 10, duration: 3, time: 0 },
      { reqId: 2, position: 3, duration: 4, time: 2 },
      { reqId: 3, position: 18, duration: 2, time: 4 },
      { reqId: 4, position: 7, duration: 5, time: 5 }
    ];

    let waitingQueue = [];
    let minute = 0;
    let completedRequests = 0;
    let totalRequests = requests.length;

    const output = document.getElementById("output");

    // Fonction pour afficher du texte dans la page
    function log(text) { 
      output.textContent += text + "\n";
      console.log(text);
    }

    log("=== SMART TAXI DISPATCHER ===");

    // === Fonction principale de simulation ===
    function simulateMinute() {
      log(`\nMinute ${minute}:`);

      // 1️⃣ Gérer les nouvelles demandes
      let newRequests = requests.filter(r => r.time === minute);
      newRequests.forEach(req => {
        let availableTaxis = taxis.filter(t => t.available);

        if (availableTaxis.length > 0) {
          // Trouver le taxi le plus proche
          let bestTaxi = availableTaxis.reduce((closest, taxi) => {
            let distTaxi = Math.abs(taxi.position - req.position);
            let distClosest = Math.abs(closest.position - req.position);
            return distTaxi < distClosest ? taxi : closest;
          });

          let distance = Math.abs(bestTaxi.position - req.position);
          log(`→ Request ${req.reqId} at position ${req.position} → Taxi ${bestTaxi.id} assigned (distance: ${distance})`);

          // Mettre à jour le taxi
          bestTaxi.available = false;
          bestTaxi.timeRemaining = req.duration;
          bestTaxi.position = req.position;
          bestTaxi.totalRides++;
        } else {
          log(`→ Request ${req.reqId} at position ${req.position} → all taxis busy → added to queue.`);
          waitingQueue.push(req);
        }
      });

      // 2️⃣ Mettre à jour l’état des taxis
      taxis.forEach(taxi => {
        if (!taxi.available) {
          taxi.timeRemaining--;

          if (taxi.timeRemaining === 0) {
            taxi.available = true;
            completedRequests++;
            log(`→ Taxi ${taxi.id} finished ride and is now available.`);

            // Si une demande attend dans la file
            if (waitingQueue.length > 0) {
              let req = waitingQueue.shift();
              let distance = Math.abs(taxi.position - req.position);
              log(`→ Taxi ${taxi.id} takes Request ${req.reqId} from queue (distance: ${distance})`);

              taxi.available = false;
              taxi.timeRemaining = req.duration;
              taxi.position = req.position;
              taxi.totalRides++;
            }
          }
        }
      });

      // 3️⃣ Vérifier si la simulation est terminée
      if (completedRequests >= totalRequests) {
        log(`\nMinute ${minute}:`);
        log("All rides completed.");
        log("\n--- Final Report ---");
        taxis.forEach(taxi => {
          log(`Taxi ${taxi.id}: ${taxi.totalRides} rides, position ${taxi.position}`);
        });
        let totalRides = taxis.reduce((sum, t) => sum + t.totalRides, 0);
        log(`Total rides: ${totalRides}`);
        log(`Total simulated time: ${minute} minutes`);
        clearInterval(timer); // arrêter la simulation
      }

      minute++;
    }

   