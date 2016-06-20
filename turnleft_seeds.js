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
setSeed(21, 10 , { beadType: 900, index : -3, bondNum : 0 } );


setSeed(17, 12 , { beadType: 1000, index : -3, bondNum : 0 } );
setSeed(17, 13 , { beadType: 800, index : -3, bondNum : 0 } );
setSeed(16, 12 , { beadType: 1000, index : -3, bondNum : 0 } );
setSeed(16, 13 , { beadType: 1000, index : -3, bondNum : 0 } );

setSeed(18, 13 , { beadType: 953, index : -3, bondNum : 0 } );
setSeed(18, 12 , { beadType: 952, index : -3, bondNum : 0 } );
setSeed(17, 11 , { beadType: 951, index : -3, bondNum : 0 } );

/*
//1part
setSeed(20, 10 , { beadType: 107, index : -3, bondNum : 0 } );
setSeed(19, 10 , { beadType: 108, index : -3, bondNum : 0 } );
setSeed(18, 10 , { beadType: 109, index : -3, bondNum : 0 } );
setSeed(17, 10 , { beadType: 110, index : -3, bondNum : 0 } );
*/
//0part

setSeed(20, 10 , { beadType: 103, index : -3, bondNum : 0 } );
setSeed(19, 10 , { beadType: 104, index : -3, bondNum : 0 } );
setSeed(18, 10 , { beadType: 109, index : -3, bondNum : 0 } );
setSeed(17, 10 , { beadType: 110, index : -3, bondNum : 0 } );

OSVars.w_path = [
    {x: 17, y: 11}
];



// seedとの境目がここで決まる.
OSVars.step = 1;
OSVars.initialStep = 1;