import { network, ethers, waffle } from "hardhat";
import { Overrides, Wallet } from "ethers";
import { Signer } from "ethers";
import { expect } from "chai";
import { IERC20, IERC20__factory } from "../src/types";

const { deployContract } = waffle;

describe("comp balance impersonate", function () {
  let comp: IERC20;
  const receiver = "0x829BD824B016326A401d083B33D092293333A830";
  const sender = "0x9bc2f223026c252c8ef5f7f33f00f4bee21434b8";
  beforeEach(async () => {
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [sender],
    });

    const signer = await ethers.provider.getSigner(sender);

    // comp token
    const compAdr = "0xc00e94cb662c3520282e6f5717214004a7f26888";

    comp = IERC20__factory.connect(compAdr, <Signer>signer);
  });
  it("Should return the balance", async function () {
    const balance = await comp.balanceOf(sender);
    console.log(
      `Sender's COMP balance is: ${ethers.utils.formatEther(balance)}`
    );
  });
  it("Should transfer the comp balance", async function () {
    const senderBalance = await comp.balanceOf(sender);
    const receiverBalance = await comp.balanceOf(receiver);
    console.log(
      `Receiver's COMP balance is: ${ethers.utils.formatEther(receiverBalance)}`
    );
    console.log(
      `Sender's COMP balance is: ${ethers.utils.formatEther(senderBalance)}`
    );

    await comp.transfer(receiver, senderBalance);

    const newSenderBalance = await comp.balanceOf(sender);
    //  newSenderBalance should be equal to 0 !
    console.log(
      `New Sender's COMP balance is: ${ethers.utils.formatEther(
        newSenderBalance
      )}`
    );
    let newReceiverBalance = await comp.balanceOf(receiver);
    console.log(
      `New Receiver's COMP  balance is: ${ethers.utils.formatEther(
        newReceiverBalance
      )}`
    );

    await comp.transfer(receiver, senderBalance);
    //  it shouldn't be possible to send the total balance twice !
    newReceiverBalance = await comp.balanceOf(receiver);
    console.log(
      `Impossible New Receiver's COMP  balance is: ${ethers.utils.formatEther(
        newReceiverBalance
      )}`
    );
  });
});
