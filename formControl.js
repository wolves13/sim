/*
  OS-simulator動作前に
  formオブジェクトから値を取得して, 
  設定を行うためのスクリプト.
  <formControl.js>
*/


// 読み込み完了時にイベントハンドラを登録.
window.onload = function () {
    document.forms.onsubmit = firstNextPushed;
};


var changeColor = function (elm, color) {
    elm.style.backgroundColor = color;
};

var btn_onclick = function () {

    var result = [];
    var list = document.getElementsByTagName('input');
    var i;

    for(i=0; i < list.length; i++){
	result.push( list.item(i).value );
    }
    window.alert( result.join('\n'));
    
    return false;
};

var firstNextPushed = function () {
    var i;
    var d = document.forms.delay;
    var a = document.forms.arity;   // ラジオボタンの配列
    var wl = document.forms.wordLength;
    var arity, delay;

    if ( d.value !== null  &&  d.value !== '' ){
	if ( isNaN( d.value ) ){

	    alert('Delay must be natural number.' );
	    d.value = d.defaultValue;
	    d.focus();
	    d.select();
	    return false;
	}
    }
    delay = d.value;

    for (i=0; i < a.length; i++) {
	if ( a[i].checked ){
	    // Arityを選択された値にセットする.
	    arity = a[i].value;
	    break;
	}
    }
    if (arity === undefined){
	alert('Pleae select arity.');
	return false;
    }

    if ( wl.value !== null  &&  wl.value !== '' ){
	if ( isNaN( wl.value ) ){

	    alert('Word length must be natural number.' );
	    wl.value = wl.defaultValue;
	    wl.focus();
	    wl.select();
	    return false;
	}
    }

    // simulator へ反映
    init_a_d( {a: arity, d: delay} );
    OSVars.cons.len = parseInt( wl.value, 10 );

    // 次の設定画面を生成する.
    return secondSettings(arity, delay);
};

var secondSettings = function (arity, delay) {

    var fm = document.forms;
    var firstSettingDiv = document.getElementById('firstSettingDiv');
    var secondSettingDiv = document.getElementById('secondSettingDiv');    
    var beadTypes = fm.beadTypes;
    var indexEqualBeadtype = fm.indexEqualBeadtype;
    var word = fm.word;

    // 以前のinput要素は, 設定を表示するだけの行へ置換する.
    var checkBoxLabel = indexEqualBeadtype.parentNode;   

    firstSettingDiv.removeChild( checkBoxLabel );          // Node 削除

    var arityDiv = document.getElementById('arityDiv');
    var newDiv = document.createElement('div');
    newDiv.innerHTML = 'Arity : ' + arity;
    firstSettingDiv.replaceChild( newDiv, arityDiv );


    var delayLabel = fm.delay.parentNode;
    delayLabel.removeChild( fm.delay );
    delayLabel.innerHTML  = 'Delay : ' + delay;

    var wordLen = fm.wordLength.value;
    var wordLenLabel = fm.wordLength.parentNode;
    wordLenLabel.removeChild( fm.wordLength );
    wordLenLabel.innerHTML = 'Word Length : ' + wordLen;

    // SecondSettingDiv を可視化.
    // checkされていたら, 自動的に(beadtypes, wordの)内容を反映する
    if (  indexEqualBeadtype.checked  ) {
	// beadTypes.disabled = true;
	word.disabled = true;
	// beadTypes.value = wordLen;
	word.innerHTML = '0-' + wordLen;

	OSVars.mode.indexEqualBeadtype = true;
    } 
    secondSettingDiv.style.visibility = "visible";
    secondSettingDiv.style.backgroundColor = "lightblue";
    firstSettingDiv.style.backgroundColor = "white";

    var nextBtnMsgDiv = document.getElementById('btnMsg');
    nextBtnMsgDiv.innerHTML = '(Seed)';
    
    fm.onsubmit = secondNextPushed;
    return false;
};

var secondNextPushed = function () {
    var fm = document.forms;
    var beadTypeNum = fm.beadTypes.value;
    var word = fm.word.innerHTML;
    
    // (Number of bead types), (word)  のcheck.
    //
    //
    // まずは自動で補完されるバージョンを扱うので, 後で実装する.
    //
    //
    //
    
    // word を OS-simulator へ反映する.
    initWord( word );
    
    return thirdSettings( beadTypeNum );
};


var thirdSettings = function ( beadTypeNum ) {

    console.log('beadTypeNum : ' + beadTypeNum );

    var secondSettingDiv = document.getElementById('secondSettingDiv');
    var fm = document.forms;
    
    // Seedの設定画面を生成.
    var beadtypeString = "Number of bead types :" + beadTypeNum ;
    var wordString =     "Word ( bead type array ) : <br>" ;
    secondSettingDiv.innerHTML = beadtypeString + '<br><br>' + wordString + OSVars.word.toString() ;
    secondSettingDiv.style.backgroundColor = "white";

    OSVars.cons.beadTypeNum = parseInt( beadTypeNum, 10 );
    setRuleset();

    // SeedType( [T,F5,F9]*[1,2,3,4] )を選択するラジオボタンを追加
    // 左側の分子3つの並び, 上の4つの並びをそれぞれ1ずつ選択させる.    
    var TFDiv = document.createElement('div');
    TFDiv.innerHTML = "Seed Type <br>  <label><input type='radio' name='TF' value='T'> T <\label> <br> <label><input type='radio' name='TF' value='F5'> F5 <\label> <br> <label><input type='radio' name='TF' value='F9'> F9 <\label> <br>";
    TFDiv.style.backgroundColor = "lightblue";
    TFDiv.style.visibility = 'hidden';
    fm.appendChild( TFDiv );

    var upperInputDiv = document.createElement('div');
    upperInputDiv.innerHTML = "Upper Input <br>  <label><input type='radio' name='upperInput' value=''> T <\label> <br> <label><input type='radio' name='TF' value='F5'> F5 <\label> <br> <label><input type='radio' name='TF' value='F9'> F9 <\label> <br>";

    
    var gridCanvas = document.getElementById('gridCanvas');
    var overCanvas = document.getElementById('overCanvas');
    gridCanvas.style.visibility = 'visible';
    overCanvas.style.visibility = 'visible';

    var dElm = document.documentElement, dBody = document.body;

    var overCanvasRect = overCanvas.getBoundingClientRect();
    // BeadCircleの付近がクリックされたら, 
    // その点の座標を計算するリスナーを登録
    overCanvas.addEventListener('mousedown', function(e) {
	var scrolledX = dElm.scrollLeft  ||  dBody.scrollLeft;       // 画面上部からのスクロール量(Chrome, Firefox)
	var scrolledY = dElm.scrollTop  ||  dBody.scrollTop;       // 画面上部からのスクロール量(Chrome, Firefox)
	var realX = (e.clientX + scrolledX) - overCanvasRect.left;  	// 実際のcanvas座標
	var realY = (e.clientY + scrolledY) - overCanvasRect.top;

	// 斜行座標でのcanvas座標(yから計算する必然性あり.)
	var ocsY = Math.round( realY / UNIT_DIST_Y );
	var floatX = (realX / UNIT_DIST_X) +  (ocsY * Math.sin( ANGLE_IN_OCS ));  
	var ocsX = Math.round( floatX );
	console.log('ocs mouse pos (ocs) : (' + ocsX + ', ' + ocsY + ')' );
    }, false);

    var submitButton = fm.nextButton;
    submitButton.value = "Execute !!";

    var nextBtnMsgDiv = document.getElementById('btnMsg');
    nextBtnMsgDiv.innerHTML = '';
    
    fm.onsubmit = execute;

    return false;
};


var execute = function () {

    /* var worker = new Worker('workerTest.js');
    console.log(OSVars);
    var obj = new Object();
    obj.a = 10;
    obj.b = 20;
    worker.postMessage(  obj  );
    worker.postMessage( {a:  100, b: 200} );

    worker.onmessage = function(e) {
	console.log( 'return from worker.');
	console.log( e.data );
    };
    */
    
    console.log('execute button pushed...');
  //////////////////////////
	//RuleSet
  //////////////////////////
  
    OSVars.ruleset[33][28]=true;
    OSVars.ruleset[3][949]=true;//
    OSVars.ruleset[3][950]=true;//
    OSVars.ruleset[33][29]=true;
    
    //1part
    
    OSVars.ruleset[6][2]=true;
    OSVars.ruleset[8][4]=true;
    OSVars.ruleset[1][9]=true;
    OSVars.ruleset[6][12]=true;
    OSVars.ruleset[10][7]=true;
    OSVars.ruleset[11][19]=true;
    OSVars.ruleset[24][15]=true;
    OSVars.ruleset[24][16]=true;
    OSVars.ruleset[14][11]=true;
    //outside
    
    //test+800ver
    OSVars.ruleset[6][926]=true;//
    OSVars.ruleset[6][925]=true;//
    OSVars.ruleset[12][926]=true;//
   	OSVars.ruleset[7][926]=true;OSVars.ruleset[37][896]=true;//
    OSVars.ruleset[5][926]=true;//
    OSVars.ruleset[7][916]=true;//
    OSVars.ruleset[13][925]=true;//
    OSVars.ruleset[13][916]=true;//
    OSVars.ruleset[15][914]=true;//
    OSVars.ruleset[24][914]=true;//
    OSVars.ruleset[4][921]=true;OSVars.ruleset[34][891]=true;//
    OSVars.ruleset[4][922]=true;
    OSVars.ruleset[6][950]=true;
    OSVars.ruleset[36][29]=true;
    
    //
    
    //
	//upper outside
	
	//test+800ver
	for(var k=1;k<=24;k++){
		for(var l=912;l<=929;l++){
			if(OSVars.ruleset[k][l]==true){
				OSVars.ruleset[k+30][l-30]=true;
				}else if(OSVars.ruleset[l][k]==true){
					OSVars.ruleset[k+30][l-30]=true;
				}
		}
	}
	
    //
    
    //glider 0parts
    for(var k=1;k<9;k++){ 	
    	OSVars.ruleset[3*k-2][3*(k+1)]  = true;
    	OSVars.ruleset[3*(k+1)][3*k-2]  = true;
   		}
    OSVars.ruleset[2][5]=true;
    OSVars.ruleset[8][11]=true;
    OSVars.ruleset[8][5]=true;
    OSVars.ruleset[17][14]=true;
    OSVars.ruleset[20][17]=true;
    OSVars.ruleset[23][20]=true;
    //
    //0parts others
    OSVars.ruleset[12][8]=true;
    //
    
    //1parts+0
    //
    OSVars.ruleset[37][28]=true;
    OSVars.ruleset[37][29]=true;
    //
	OSVars.ruleset[12][3]=true;
    OSVars.ruleset[12][4]=true;
    OSVars.ruleset[10][4]=true;
    //
    
	
	//outside
	OSVars.ruleset[7][950]=true;
	OSVars.ruleset[7][949]=true;
	OSVars.ruleset[3][922]=true;//
	
	OSVars.ruleset[12][922]=true;//
	//
	//upper
	OSVars.ruleset[33][892]=true;//
	OSVars.ruleset[42][892]=true;//
	//
	 
	

    //connections
    OSVars.ruleset[26][23]=true;
    OSVars.ruleset[30][26]=true;
    OSVars.ruleset[27][22]=true;
    OSVars.ruleset[29][26]=true;
    OSVars.ruleset[30][25]=true;
    OSVars.ruleset[57][52]=true;
    OSVars.ruleset[60][55]=true;
    
    //
    
    //upper
    for(var k=1;k<=24;k++){
		for(var l=1;l<=24;l++){
			if(OSVars.ruleset[k][l]==true){OSVars.ruleset[k+30][l+30]=true;}
		}
	}
    //
    
    
    
    //left-turn
    OSVars.ruleset[62][59]=true;
    OSVars.ruleset[63][58]=true;
    OSVars.ruleset[64][62]=true;
    OSVars.ruleset[64][66]=true;
    OSVars.ruleset[65][67]=true;
    OSVars.ruleset[66][63]=true;
    OSVars.ruleset[69][63]=true;
    OSVars.ruleset[69][58]=true;
    OSVars.ruleset[70][58]=true;
    OSVars.ruleset[71][68]=true;
    OSVars.ruleset[70][72]=true;
    OSVars.ruleset[71][73]=true;
    OSVars.ruleset[76][70]=true;
    //
    
    //2nd
    //outside
    OSVars.ruleset[79][45]=true;
    OSVars.ruleset[79][49]=true;
    OSVars.ruleset[79][48]=true;
	
    //inside
    OSVars.ruleset[81][78]=true;
    OSVars.ruleset[82][75]=true;
    OSVars.ruleset[82][77]=true;
    OSVars.ruleset[83][74]=true;
    OSVars.ruleset[85][80]=true;
    OSVars.ruleset[88][79]=true;
    OSVars.ruleset[88][80]=true;
    //2nd-0
    OSVars.ruleset[90][34]=true;//outside
    OSVars.ruleset[91][34]=true;//
    OSVars.ruleset[90][37]=true;//
    OSVars.ruleset[91][36]=true;//
    OSVars.ruleset[93][90]=true;
    OSVars.ruleset[95][86]=true;
    OSVars.ruleset[100][31]=true;
    OSVars.ruleset[100][33]=true;
   	//2nd-1
   	OSVars.ruleset[91][86]=true;
   	OSVars.ruleset[94][89]=true;
   	OSVars.ruleset[97][92]=true;
   	OSVars.ruleset[100][31]=true;
   	OSVars.ruleset[100][37]=true;
   	///////////////////////////////
   	//connect
   	OSVars.ruleset[103][98]=true;
   	OSVars.ruleset[106][101]=true;
    //2nd-0-low
    for(var k=89;k<=101;k++){
		for(var l=31;l<=55;l++){
			if(OSVars.ruleset[k][l]==true){
				OSVars.ruleset[k+30][l-30]=true;
				}else if(OSVars.ruleset[l][k]==true){
					OSVars.ruleset[k+30][l-30]=true;
				}
		}
	}
    //2nd-low
    OSVars.ruleset[106][27]=true;OSVars.ruleset[106][25]=true;
    OSVars.ruleset[106][101]=true;
    for(var k=74;k<=101;k++){
		for(var l=74;l<=97;l++){
			if(OSVars.ruleset[k][l]==true){OSVars.ruleset[k+30][l+30]=true;}
		}
	}
    //2nd-low-outside
    OSVars.ruleset[118][15]=true;
    OSVars.ruleset[109][19]=true;
    OSVars.ruleset[109][13]=true;
    OSVars.ruleset[109][15]=true;
    OSVars.ruleset[108][19]=true;
    //
    
    //
    //right turn
    OSVars.ruleset[130][1]=true;
    OSVars.ruleset[131][136]=true;
    OSVars.ruleset[133][128]=true;
    OSVars.ruleset[139][134]=true;
    OSVars.ruleset[140][138]=true;
    OSVars.ruleset[141][139]=true;
    OSVars.ruleset[142][140]=true;
    OSVars.ruleset[143][141]=true;
	OSVars.ruleset[144][141]=true;
    OSVars.ruleset[145][143]=true;
    OSVars.ruleset[148][139]=true;
	OSVars.ruleset[151][146]=true;
	    
    //next
    
     for(var i=1;i<57;i++){
    	for(var j=883;j<929;j++){
    		if(OSVars.ruleset[i][j] == true){
    			OSVars.ruleset[i+151][j-800]  = true;
    			for(var n=2;n<5;n++){
    				var k=151*n;
    				OSVars.ruleset[i+151*n][j+(151*(n-1))-800]  = true;
    			}
    		}
    	}
   	}
   	
   	
	for(var i=1;i<12;i++){
    	for(var j=949;j<952;j++){
    		if(OSVars.ruleset[i][j] == true){
    			OSVars.ruleset[i+151][j-800]  = true;
    			var num=i+151;
    			var num2=j-800;
    			for(var n=1;n<4;n++){
    				OSVars.ruleset[num+151*n][num2+n*151]  = true;
    			}
    			}
    	}
   	}
    for(var n=1;n<5;n++){
    	for(var i=1;i<152;i++){
    		for(var j=1;j<152;j++){
    			if(OSVars.ruleset[i][j] == true){OSVars.ruleset[i+151*n][j+151*n]  = true;}
    		}
   		}
   }
   
   	//
    //Completion
    for(var i=0;i<1000;i++){
    	for(var j=0;j<1000;j++){
    		if(OSVars.ruleset[i][j] == true){OSVars.ruleset[j][i]  = true;}
    	}
   	}
    //
    // RuleSet おわり
    /*
     * 
     */
    // show_occupied_in_binary_2();
    
    console.log( OSVars );

    // シミュレータの実行
    runStatus = runSimu();
    console.log('runSimu finished.');
    
    var fm = document.forms;
    var exeBtn = fm.nextButton;
    exeBtn.disabled = 'true';

    console.log('step: ' + OSVars.step); 

    for(i=0 ; i<OSVars.step  ; i++){
	var p = OSVars.w_path[ i ];
	var bead = OSVars.occupied[p.x][p.y];
	var str = '';

	str = str.concat('occupied[' + p.x + '][' + p.y + '] == ');
	str = str.concat( 'beadType : ' + bead.beadType ); 
	str = str.concat( '__ index : ' + bead.index ); 
	str = str.concat( '__ bondNum : ' + bead.bondNum ); 
	console.log( str );
    }
    /*  Fixされた鎖をCanvasへ描画 */
    reflectFixedPath();

    var bonds = OSVars.hbonds;
    console.log('---------- Hbonds list ----------'); 
    for(i=0; i < bonds.length; i++){
	console.log( '[' + bonds[i][0].x + ']' + '[' +  bonds[i][0].y +'] << --- >> ['
		     + bonds[i][1].x + ']' + '[' +  bonds[i][1].y +']');
    }
    /* 決定したHbondをCanvasへ描画 */
    reflectFixedHbond();

    // nonDetRoutesが空でない, つまりNon Deterministicならば, 
    // formに, 最適性が等しい構造の表示を順次切り替えるボタンを追加.
    if ( runStatus == false ) {
	if ( nonDetRoutes.length > 0 ) {
	    var p = document.createElement('p');
	    p.innerHTML = '========= Non Deterministic ==========';
	    fm.appendChild( p );
	    var lab = document.createElement('label');
	    var elm = document.createElement('input');
	    var txt = document.createTextNode('(' + nonDetRoutes.length + ' folding routes)');

	    elm.type  =  "button";
	    elm;name  = "route";
	    elm.value  =  "changeRoute";
	    elm.onclick = reflectNonDetRoute();    // イベントハンドラ
	    lab.appendChild( elm );
	    lab.appendChild( txt );
	    fm.appendChild( lab );
	} else {
	    var p = document.createElement('p');
	    p.innerHTML = '========= Non Deterministic in One Route ==========';
	    fm.appendChild( p );
	}
	
    } else {
	var p = document.createElement('p');
	p.innerHTML = '========= Deterministic ==========';
	fm.appendChild( p );
    }

    return false;
};
