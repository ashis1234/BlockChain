App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Vaccine.json", function(Vaccine) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Vaccine = TruffleContract(Vaccine);
      // Connect provider to interact with contract
      App.contracts.Vaccine.setProvider(App.web3Provider);

      console.log("ff");
      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Vaccine.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.vaccineEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var loader = $("#loader");
    var content = $("#content");
    var vaccineInstance;
    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      console.log(account)
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Vaccine.deployed({'from' : App.account}).then(function(instance) {
      vaccineInstance = instance;
      return vaccineInstance.citizenCount();
    })
    .then(function(citizenCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      for (var i = 0; i < citizenCount; i++) {
        
        vaccineInstance.Citizens(i).then(function(candidate) {
          var id = candidate[0];
          var name = candidate[1];
          console.log(candidate)
          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + candidate[2] + "</td><td>" + candidate[3] + "</td><td>" + candidate[5] + "</td></tr>"
          candidatesResults.append(candidateTemplate);
        });
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });

    App.contracts.Vaccine.deployed({'from' : App.account}).then(function(instance) {
      vaccineInstance = instance;
      return vaccineInstance.hospitalCount();
    })
    .then(function(hospitalCount) {
      console.log(hospitalCount)
      var candidatesResults = $("#candidatesResults1");
      candidatesResults.empty();

      for (var i = 0; i < hospitalCount; i++) {
        console.log(vaccineInstance)
        vaccineInstance.HospitalsID(i).then(function(hospital) {
          console.log(hospital)
          var candidateTemplate = "<tr><th>" + hospital[0] + "</th><td>" + hospital[1] + "</td><td>" + hospital[2] + "</td><td>" + hospital[3] + "</td><td>" + hospital[4] + "</td><td>" + hospital[5]+"</td><td>" + hospital[7]+"</td></tr>"
          candidatesResults.append(candidateTemplate);
        });
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });

    App.contracts.Vaccine.deployed({'from' : App.account}).then(function(instance) {
      vaccineInstance = instance;
      return vaccineInstance.manufacturerCount();
    })
    .then(function(manufacturerCount) {
      var candidatesResults = $("#candidatesResults2");
      candidatesResults.empty();

      for (var i = 0; i < manufacturerCount; i++) {
        vaccineInstance.ManufacturersID(i).then(function(hospital) {
          console.log(hospital);
          var candidateTemplate = "<tr><th>" + hospital[0] + "</th><td>" + hospital[1] + "</td><td>" + hospital[2] + "</td><td>" + hospital[3] + "</td><td>" + hospital[4] + "</td><td>" + hospital[5]+"</td><td>" + hospital[6]+"</td></tr>"
          candidatesResults.append(candidateTemplate);
        });
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });

    App.contracts.Vaccine.deployed({'from' : App.account}).then(function(instance) {
      vaccineInstance = instance;
      return vaccineInstance.appointmentCount();
    })
    .then(function(appointmentCount) {
      var candidatesResults = $("#candidatesResults3");
      candidatesResults.empty();

      for (var i = 0; i < appointmentCount; i++) {
        console.log(vaccineInstance)
        vaccineInstance.Appointments(i).then(function(hospital) {
          console.log(hospital)
          var candidateTemplate = "<tr><th>" + hospital[0] + "</th><td>" + hospital[1] + "</td><td>" + hospital[3] + "</td><td>" + hospital[5] + "</td><td>" + hospital[6]+"</td><td>" + hospital[7]+"</td></tr>"
          candidatesResults.append(candidateTemplate);
        });
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});