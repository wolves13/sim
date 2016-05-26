// <initial.js>
// Similator of 2D Oritatami System.
// initialize OS-simulator's name space.
//  and a bit more..

//////////
// Grobal な 値の定義
INITIAL_GRID_SIZE_X = 64;
INITIAL_GRID_SIZE_Y = 64;

var nonDetRoutes = [];   // nondeterministic なとき, 複数のRouteを保存する用.
var nonDetHbonds = [];   // nondeterministic なとき, 複数のHbondの組を保存する用.


var adjacents = [ {x: 1, y: 0}, {x: -1, y: 0},
		  {x: 0, y: 1}, {x: 0,  y: -1},
		  {x: 1, y: 1}, {x: -1, y: -1} ];

// Oritataim System が持つべき変数群を収める名前空間.
var OSVars = {
    cons : {
	     alpha : 2,         // alpha, deltaはこの値を上書きする.
             delta : 3,
             len   : 15,        // 高分子鎖の長さ (seedも含める) .
	     beadTypeNum : 0    // 高分子の種類.
    },

    mode : { 
	indexEqualBeadtype : false
    },

    word   :   [ ],    // 高分子の鎖を順にならべたリスト.
    w_path :   [ ],    // 高分子の鎖が辿った点のリスト

    ruleset :  [],     // 高分子種どうしが水素結合を結べるかどうか定める. 2dMatrix.

    occupied : [],     // 点の占有情報. [(高分子種,index,hbond数)/false] を２次元配列で保存.
                       

    oc_size  : { x: INITIAL_GRID_SIZE_X, 
		 y: INITIAL_GRID_SIZE_Y },   // occupied配列の[縦/横]幅

    // bond_num :   [],   // 各高分子が結んでいるhbondの数(現在未使用)
    hbonds   :   [],   // 実際に形成されたhbondの情報 [pi,pj] (i != j) をもつ 

    step :   0,         // 最適化ステップの段階.1ずつ増える.
                       // 現在, indexいくつの高分子位置を最適化しているかを表す.
    initialStep : 0
};
//
//////////

initOccupied( INITIAL_GRID_SIZE_X, INITIAL_GRID_SIZE_Y );


// occupied配列の初期設定(seed)

setSeed(11, 7 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(12, 7 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(13, 7 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(14, 7 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(15, 7 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(16, 7 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(17, 7 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(18, 7 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(19, 7 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(20, 7 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(21, 7 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(22, 7 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(23, 7 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(24, 7 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(25, 7 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(26, 7 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(27, 7 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(28, 7 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(29, 7 , { beadType: 100, index : -3, bondNum : 0 } );


setSeed(38, 7 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(40, 9 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(41, 10 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(42, 10 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(43, 10 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(39, 9 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(39, 8 , { beadType: 0, index : -3, bondNum : 0 } );//start points +0
setSeed(40, 10 , { beadType: 89, index : -3, bondNum : 0 } );//start points +1



//0parts
setSeed(30, 7 , { beadType: 201, index : -3, bondNum : 0 } );//con
setSeed(31, 7 , { beadType: 210, index : -3, bondNum : 0 } );//con
setSeed(32, 7 , { beadType: 211, index : -3, bondNum : 0 } );
setSeed(33, 7 , { beadType: 212, index : -3, bondNum : 0 } );
setSeed(34, 7 , { beadType: 213, index : -3, bondNum : 0 } );
setSeed(35, 7 , { beadType: 222, index : -3, bondNum : 0 } );
setSeed(36, 7 , { beadType: 223, index : -3, bondNum : 0 } );
setSeed(37, 7 , { beadType: 224, index : -3, bondNum : 0 } );


//1parts
/*
setSeed(30, 7 , { beadType: 201, index : -3, bondNum : 0 } );
setSeed(31, 7 , { beadType: 206, index : -3, bondNum : 0 } );//con
setSeed(32, 7 , { beadType: 207, index : -3, bondNum : 0 } );
setSeed(33, 7 , { beadType: 212, index : -3, bondNum : 0 } );
setSeed(34, 7 , { beadType: 213, index : -3, bondNum : 0 } );
setSeed(35, 7 , { beadType: 218, index : -3, bondNum : 0 } );
setSeed(36, 7 , { beadType: 219, index : -3, bondNum : 0 } );
setSeed(37, 7 , { beadType: 224, index : -3, bondNum : 0 } );

*/
//

OSVars.w_path = [
    {x: 39, y: 8}
];

//29,0,41;28,0,40;27,0,39;26,0,30;25,0,27;24,0,26;23,0,21;22,0,20;21,0,15;20,0,14;19,0,11;18,0,10;17,0,9;16,0,0;15,0,57;14,0,56;13,0,51;12,0,50;11,0,45;10,0,44;9,0,41;8,0,40;7,0,39;6,0,30;5,0,29;4,0,28;3,0,27;30,-3,59;31,-3,58;32,-3,57;30,-2,53;30,-1,52;30,0,42



// seedとの境目がここで決まる.
OSVars.step = 1;
OSVars.initialStep = 1;

// len = 65??
