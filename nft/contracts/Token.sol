// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC721, Ownable {
  struct Athlete {
    uint256 id;
    uint256 caloriesBurned;
    uint256 weight;
    uint256 height;
    uint256 distanceTravelled;
    uint256 lastStreak;
    uint256 stage;
    uint256 parentOne;
    uint256 parentTwo;
  }

  uint nextId = 0;

  mapping(uint256 => Athlete) _athleteDetails;

  constructor(string memory name, string memory symbol) ERC721(name, symbol) {

  }

  function getTokenDetails(uint256 tokenId) public view returns (Athlete memory) {
    return _athleteDetails[tokenId];
  }

  function mint(uint256 id, uint256 caloriesBurned, uint256 weight, uint256 height, uint256 distanceTravelled, uint256 lastStreak, uint256 stage, uint256 p1, uint256 p2) public onlyOwner {
    _athleteDetails[nextId] = Athlete(id, caloriesBurned, weight, height, distanceTravelled, lastStreak, stage, p1, p2);
    _safeMint(msg.sender, nextId);
    nextId++;
  }

  function workout(uint256 tokenId, uint256 id, uint burned, uint distance) public {
    Athlete storage athlete = _athleteDetails[tokenId];
    require(athlete.stage <= 20);
    athlete.id = id;
    athlete.caloriesBurned = burned;
    athlete.distanceTravelled = distance;
    athlete.stage = athlete.stage + 1;
    athlete.lastStreak = block.timestamp;
  }
}