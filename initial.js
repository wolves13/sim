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



setSeed(28, 7 , { beadType: 0, index : -3, bondNum : 0 } );
setSeed(29, 7 , { beadType: 0, index : -3, bondNum : 0 } );



setSeed(38, 7 , { beadType: 225, index : -3, bondNum : 0 } );
setSeed(40, 9 , { beadType: 100, index : -3, bondNum : 0 } );

setSeed(42, 10 , { beadType: 100, index : -3, bondNum : 0 } );
setSeed(43, 10 , { beadType: 100, index : -3, bondNum : 0 } );



//test+500ver
//0part upper

setSeed(20, 7 , { beadType: 874, index : -3, bondNum : 0 } );
setSeed(21, 7 , { beadType: 883, index : -3, bondNum : 0 } );
setSeed(22, 7 , { beadType: 884, index : -3, bondNum : 0 } );
setSeed(23, 7 , { beadType: 885, index : -3, bondNum : 0 } );
setSeed(24, 7 , { beadType: 886, index : -3, bondNum : 0 } );
setSeed(25, 7 , { beadType: 895, index : -3, bondNum : 0 } );
setSeed(26, 7 , { beadType: 896, index : -3, bondNum : 0 } );
setSeed(27, 7 , { beadType: 897, index : -3, bondNum : 0 } );



//1part upper
/*
setSeed(20, 7 , { beadType: 874, index : -3, bondNum : 0 } );
setSeed(21, 7 , { beadType: 883, index : -3, bondNum : 0 } );
setSeed(22, 7 , { beadType: 884, index : -3, bondNum : 0 } );
setSeed(23, 7 , { beadType: 885, index : -3, bondNum : 0 } );
setSeed(24, 7 , { beadType: 886, index : -3, bondNum : 0 } );
setSeed(25, 7 , { beadType: 891, index : -3, bondNum : 0 } );
setSeed(26, 7 , { beadType: 892, index : -3, bondNum : 0 } );
setSeed(27, 7 , { beadType: 897, index : -3, bondNum : 0 } );
*/


//0parts lower

setSeed(30, 7 , { beadType: 904, index : -3, bondNum : 0 } );
setSeed(31, 7 , { beadType: 913, index : -3, bondNum : 0 } );
setSeed(32, 7 , { beadType: 914, index : -3, bondNum : 0 } );
setSeed(33, 7 , { beadType: 915, index : -3, bondNum : 0 } );
setSeed(34, 7 , { beadType: 916, index : -3, bondNum : 0 } );
setSeed(35, 7 , { beadType: 925, index : -3, bondNum : 0 } );
setSeed(36, 7 , { beadType: 926, index : -3, bondNum : 0 } );
setSeed(37, 7 , { beadType: 927, index : -3, bondNum : 0 } );


//1parts lower
/*
setSeed(30, 7 , { beadType: 904, index : -3, bondNum : 0 } );
setSeed(31, 7 , { beadType: 913, index : -3, bondNum : 0 } );
setSeed(32, 7 , { beadType: 914, index : -3, bondNum : 0 } );
setSeed(33, 7 , { beadType: 915, index : -3, bondNum : 0 } );
setSeed(34, 7 , { beadType: 916, index : -3, bondNum : 0 } );
setSeed(35, 7 , { beadType: 921, index : -3, bondNum : 0 } );
setSeed(36, 7 , { beadType: 922, index : -3, bondNum : 0 } );
setSeed(37, 7 , { beadType: 927, index : -3, bondNum : 0 } );
*/



//start point
setSeed(39, 8 , { beadType: 949, index : -3, bondNum : 0 } );//start points +0
setSeed(40, 10 , { beadType: 951, index : -3, bondNum : 0 } );//start points +1
OSVars.w_path = [
    {x: 40, y: 10}
];



setSeed(39, 9 , { beadType: 950, index : -3, bondNum : 0 } );
setSeed(41, 10 , { beadType: 946, index : -3, bondNum : 0 } );//+1


// seedとの境目がここで決まる.
OSVars.step = 1;
OSVars.initialStep = 1;

