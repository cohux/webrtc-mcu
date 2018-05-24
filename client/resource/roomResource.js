"use strict";
var dataAccess = require("../data_access"),
  cloudHandler = require("../cloudHandler"),
  logger = require("./../logger").logger,
  e = require("../errors"),
  log = logger.getLogger("RoomResource");
(exports.represent = function(o, r, t) {
  var a = o.authData;
  dataAccess.room.get(a.service._id, o.params.room, function(n, i) {
    i
      ? (log.info("Representing room ", i._id, "of service ", a.service._id),
        r.send(i))
      : (log.info("Room ", o.params.room, " does not exist"),
        t(new e.NotFoundError("Room not found")));
  });
}),
  (exports.deleteRoom = function(o, r, t) {
    var a = o.authData;
    dataAccess.room.delete(a.service._id, o.params.room, function(n, i) {
      if (n) return t(n);
      if (i) {
        var d = o.params.room;
        log.debug("Room ", d, " deleted for service ", a.service._id),
          cloudHandler.deleteRoom(d, function() {}),
          r.send("Room deleted"),
          i.sip &&
            (log.debug("Notify SIP Portal on delete Room"),
            cloudHandler.notifySipPortal("delete", i, function() {}));
      } else log.info("Room ", o.params.room, " does not exist"), t(new e.NotFoundError("Room not found"));
    });
  }),
  (exports.updateRoom = function(o, r, t) {
    var a = o.authData;
    o.body;
    dataAccess.room.get(a.service._id, o.params.room, function(n, i) {
      if (i) {
        var d = o.body;
        dataAccess.room.update(a.service._id, o.params.room, d, function(o, a) {
          if (a) {
            r.send(a);
            var n,
              d,
              s = i.sip,
              u = a.sip;
            if (!s && u) n = "create";
            else if (s && !u) n = "delete";
            else if (s && u)
              for (d in u)
                if (s[d] !== u[d]) {
                  n = "update";
                  break;
                }
            n &&
              (log.debug("Change type", n),
              cloudHandler.notifySipPortal(n, a, function() {}));
          } else t(new e.BadRequestError("Bad room configuration"));
        });
      } else
        log.info("Room ", o.params.room, " does not exist"),
          t(new e.NotFoundError("Room not found"));
    });
  }),
  (exports.validate = function(o, r, t) {
    var a = o.authData;
    dataAccess.room.get(a.service._id, o.params.room, function(r, a) {
      if (r) return t(r);
      a
        ? ((o.authData.room = a), t())
        : t(new e.NotFoundError("Room not found"));
    });
  });
exports.updateRooms = function(o, r, t) {
  var a = o.authData;
  var service = o.body.service
  var room = o.body.room
  dataAccess.room.get(service, o.params.room, function(n, i) {
    if (i) {
      var d = o.body;
      dataAccess.room.update(service, o.params.room, room, function(o, a) {
        if (a) {
          r.send(a);
          var n,
            d,
            s = i.sip,
            u = a.sip;
          if (!s && u) n = "create";
          else if (s && !u) n = "delete";
          else if (s && u)
            for (d in u)
              if (s[d] !== u[d]) {
                n = "update";
                break;
              }
          n &&
            (log.debug("Change type", n),
            cloudHandler.notifySipPortal(n, a, function() {}));
        } else t(new e.BadRequestError("Bad room configuration"));
      });
    } else
      log.info("Room ", o.params.room, " does not exist"),
        t(new e.NotFoundError("Room not found"));
  });
}