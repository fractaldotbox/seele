import { createEnsPublicClient } from "@ensdomains/ensjs";
import { http, createPublicClient } from "viem";
import { baseSepolia, mainnet, sepolia } from "viem/chains";
import { normalize } from "viem/ens";

// Create the client
const publicClient = createPublicClient({
	chain: mainnet,
	transport: http(),
});

export const getSocialsFromEns = async (
	ensName: string,
): Promise<{ twitter: string | null; github: string | null }> => {
	const twitter = await publicClient.getEnsText({
		name: normalize(ensName),
		key: "com.twitter",
	});

	const github = await publicClient.getEnsText({
		name: normalize(ensName),
		key: "com.github",
	});

	return {
		twitter: twitter ?? null,
		github: github ?? null,
	};
};

export const getTop200EnsSocials = async () => {
	const ensNames = [
		{
			name: null,
		},
		{
			name: "appleelqqa.eth",
		},
		{
			name: "taoli.eth",
		},
		{
			name: "skaret.eth",
		},
		{
			name: "skiareal.eth",
		},
		{
			name: "amitzavery.eth",
		},
		{
			name: "eu.flyboy2.eth",
		},
		{
			name: "49415.eth",
		},
		{
			name: "beeplesfirst5000days.eth",
		},
		{
			name: "linliu.luxe",
		},
		{
			name: "concord.eth",
		},
		{
			name: "7261111.eth",
		},
		{
			name: "23h17.eth",
		},
		{
			name: "ecosystemvision.eth",
		},
		{
			name: "the💯51.eth",
		},
		{
			name: "me-usa.eth",
		},
		{
			name: "blockchainxml.eth",
		},
		{
			name: "satori.wtf",
		},
		{
			name: "isitai.eth",
		},
		{
			name: "-07270.eth",
		},
		{
			name: "shoplifters.eth",
		},
		{
			name: "bobbleheads.eth",
		},
		{
			name: "nijo.eth",
		},
		{
			name: "bogimp.eth",
		},
		{
			name: "_harem.eth",
		},
		{
			name: "dutabiejie.eth",
		},
		{
			name: "weicuan.eth",
		},
		{
			name: "•3217.eth",
		},
		{
			name: "doodle6407.eth",
		},
		{
			name: "96430.eth",
		},
		{
			name: "starseekers.eth",
		},
		{
			name: "4lpalindromes.eth",
		},
		{
			name: "hodlmemeio.eth",
		},
		{
			name: "$102.eth",
		},
		{
			name: "kylegarvanbeats.eth",
		},
		{
			name: "tiny.$stoned.eth",
		},
		{
			name: "afterworkvc.eth",
		},
		{
			name: "ywnbaw.eth",
		},
		{
			name: "deepwhois.eth",
		},
		{
			name: "hylyt.eth",
		},
		{
			name: "0xfuckman.eth",
		},
		{
			name: "liveone.eth",
		},
		{
			name: "096900.eth",
		},
		{
			name: "carpe-diem.eth",
		},
		{
			name: "dgww.eth",
		},
		{
			name: "xlivesex.eth",
		},
		{
			name: "mr👨‍💼.eth",
		},
		{
			name: "jessedillow.eth",
		},
		{
			name: "201509.eth",
		},
		{
			name: "sitesurvey.eth",
		},
		{
			name: "mjuarez.eth",
		},
		{
			name: "piepie.eth",
		},
		{
			name: "phillipos.eth",
		},
		{
			name: "-9⃣6⃣4⃣.eth",
		},
		{
			name: "orchidtoken.eth",
		},
		{
			name: "6⃣9⃣0⃣4⃣9⃣.eth",
		},
		{
			name: "q43treae2.eth",
		},
		{
			name: "ethereumwrapped.eth",
		},
		{
			name: "modernism.eth",
		},
		{
			name: "eigh8.eth",
		},
		{
			name: "josemato.eth",
		},
		{
			name: "sadakat.eth",
		},
		{
			name: "kalita.eth",
		},
		{
			name: "cgiii.auth.eth",
		},
		{
			name: "singaporefund.eth",
		},
		{
			name: "sapusa.eth",
		},
		{
			name: "did8822.eth",
		},
		{
			name: "零一二三四五六七八九.eth",
		},
		{
			name: "nexair.eth",
		},
		{
			name: "fryeguy.eth",
		},
		{
			name: "tyler88.loopring.eth",
		},
		{
			name: "06283.eth",
		},
		{
			name: "686-686.eth",
		},
		{
			name: "littlebites.eth",
		},
		{
			name: "مؤسسة.eth",
		},
		{
			name: "deletions.eth",
		},
		{
			name: "annebelle.eth",
		},
		{
			name: "6⃣1⃣3⃣7⃣.eth",
		},
		{
			name: "keplerz.eth",
		},
		{
			name: "fuckethereum.eth",
		},
		{
			name: "0⃣1⃣0⃣1⃣8⃣.eth",
		},
		{
			name: "carbon.aragonid.eth",
		},
		{
			name: "666_.eth",
		},
		{
			name: "borispol.eth",
		},
		{
			name: "nathanmiers.eth",
		},
		{
			name: "malan.vafa66.eth",
		},
		{
			name: "salondigital.eth",
		},
		{
			name: "hialeah.eth",
		},
		{
			name: "•8631.eth",
		},
		{
			name: "kirty.eth",
		},
		{
			name: "674900.eth",
		},
		{
			name: "aguadelimon.eth",
		},
		{
			name: "miridian.eth",
		},
		{
			name: "williamjjohnson.eth",
		},
		{
			name: "fgbnghkmhjvfgjmh.eth",
		},
		{
			name: "34513.eth",
		},
		{
			name: "metaherb.eth",
		},
		{
			name: "kiiw.eth",
		},
		{
			name: "rossman6661.eth",
		},
		{
			name: "sammiegirl411.eth",
		},
		{
			name: "BananaPowder.eth",
		},
		{
			name: "sham🪨.eth",
		},
		{
			name: "ensloveu.eth",
		},
		{
			name: "themisnetwork.eth",
		},
		{
			name: "0⃣3⃣8⃣4⃣1⃣.eth",
		},
		{
			name: "lartisien.eth",
		},
		{
			name: "davidpetersen.eth",
		},
		{
			name: "dakkon.eth",
		},
		{
			name: "rewards.soundcrypto.eth",
		},
		{
			name: "184700.eth",
		},
		{
			name: "capn-cook.eth",
		},
		{
			name: "melodymoney.eth",
		},
		{
			name: "oadby.eth",
		},
		{
			name: "swapfish.eth",
		},
		{
			name: "jesus_.eth",
		},
		{
			name: "fortistar.eth",
		},
		{
			name: "63738.eth",
		},
		{
			name: "among.eth",
		},
		{
			name: "1307031.eth",
		},
		{
			name: "bfastclub.eth",
		},
		{
			name: "delaware1.eth",
		},
		{
			name: "melloyellow.eth",
		},
		{
			name: "stevecarelldeployer.eth",
		},
		{
			name: "v-v-s.eth",
		},
		{
			name: "artbabble.eth",
		},
		{
			name: "openbarrio.eth",
		},
		{
			name: "jeffreybeer.eth",
		},
		{
			name: "kblock.eth",
		},
		{
			name: "theaniketg.eth",
		},
		{
			name: "٦١٦٢.eth",
		},
		{
			name: "💻🧑‍💻.eth",
		},
		{
			name: "🧟‍♂🧟‍♀🧟‍♀🧟‍♀.eth",
		},
		{
			name: "brett2deployer.eth",
		},
		{
			name: "cn996.us996.eth",
		},
		{
			name: "y00tlabs.eth",
		},
		{
			name: "scotttaylor.eth",
		},
		{
			name: "420newtons.eth",
		},
		{
			name: "cityzenfarm.eth",
		},
		{
			name: "0x6561.eth",
		},
		{
			name: "310032.eth",
		},
		{
			name: "baranyai.eth",
		},
		{
			name: "blackrock.mogs.eth",
		},
		{
			name: "2dgirls.eth",
		},
		{
			name: "٧٩٨٩.eth",
		},
		{
			name: "onewheel.stateofus.eth",
		},
		{
			name: "2729.ismymooncat.eth",
		},
		{
			name: "cortesiaconcreto.eth",
		},
		{
			name: "bitofme.eth",
		},
		{
			name: "veryboredcoffee.eth",
		},
		{
			name: "zhugepro.eth",
		},
		{
			name: "mr069.eth",
		},
		{
			name: "$1083.eth",
		},
		{
			name: "28359.eth",
		},
	];

	const socialRecords = await Promise.all(
		ensNames
			.filter((ensName) => ensName.name !== null)
			.filter(
				(ensName) => ensName.name.includes("[") || ensName.name.includes("]"),
			)
			.map((ensName) => getSocialsFromEns(ensName.name)),
	);

	return socialRecords.filter(
		(socialRecord): socialRecord is { twitter: string; github: string } =>
			(socialRecord?.twitter ?? null) !== null,
	);
};

export const getInfluentialEnsTwitters = async () => {
	const names = [
		"vitalik.eth",
		"jesse.xyz",
		"nick.eth",
		"austingriffith.eth",
		"dwr.eth",
		"sassal.eth",
		"barmstrong.eth",
		"ansgar.eth",
	];

	const socialRecords = await Promise.all(
		names.map((name) => getSocialsFromEns(name)),
	);

	return socialRecords.filter(
		(socialRecord): socialRecord is { twitter: string; github: string } =>
			(socialRecord?.twitter ?? null) !== null,
	);
};
